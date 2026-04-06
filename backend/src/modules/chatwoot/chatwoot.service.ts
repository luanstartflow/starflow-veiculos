import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

const SCRIPT_MARKER = '<!-- GlobalVeiculos KanbanCW -->';

@Injectable()
export class ChatwootService implements OnModuleInit {
  private readonly logger = new Logger(ChatwootService.name);

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.injectDashboardScript();
    } catch (err) {
      // Log but don't crash — Chatwoot DB might be unreachable in some envs
      this.logger.error('Failed to inject dashboard script into Chatwoot', err);
    }
  }

  async injectDashboardScript(): Promise<void> {
    const chatwootDbUrl = this.config.get<string>('chatwootDatabaseUrl');
    const kanbancwDomain = this.config.get<string>('kanbancwDomain');

    if (!chatwootDbUrl || !kanbancwDomain) {
      this.logger.warn('CHATWOOT_DATABASE_URL or KANBANCW_DOMAIN not set — skipping script injection');
      return;
    }

    const client = new Client({ connectionString: chatwootDbUrl });

    try {
      await client.connect();
      this.logger.log('Connected to Chatwoot database');

      await this.validateChatwootSchema(client);
      await this.upsertDashboardScript(client, kanbancwDomain);
    } finally {
      await client.end();
    }
  }

  private async validateChatwootSchema(client: Client): Promise<void> {
    const result = await client.query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'installation_configs'
      ) AS exists
    `);

    if (!result.rows[0].exists) {
      throw new Error('Chatwoot installation_configs table not found — is this a valid Chatwoot DB?');
    }

    this.logger.log('Chatwoot schema validated');
  }

  private async upsertDashboardScript(client: Client, domain: string): Promise<void> {
    const scriptTag = `${SCRIPT_MARKER}\n<script src="https://${domain}/dashboard-script" defer></script>`;

    // Detect which column name Chatwoot uses (older: "value", newer: "serialized_value")
    const colCheck = await client.query<{ column_name: string }>(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'installation_configs'
        AND column_name IN ('value', 'serialized_value')
      LIMIT 1
    `);
    const col = colCheck.rows[0]?.column_name ?? 'serialized_value';

    // Read current value
    const existing = await client.query<{ col_value: string }>(
      `SELECT "${col}" AS col_value FROM installation_configs WHERE name = 'dashboard_scripts' LIMIT 1`,
    );

    // serialized_value is stored as JSON ("\"<script>...\""), plain "value" is text
    const rawValue = existing.rows[0]?.col_value ?? '';
    let currentValue: string;
    try {
      currentValue = col === 'serialized_value' && rawValue ? JSON.parse(rawValue) as string : rawValue;
    } catch {
      currentValue = rawValue;
    }

    // Already up-to-date — idempotent check
    if (currentValue.includes(scriptTag)) {
      this.logger.log('Dashboard script already injected and up-to-date');
      return;
    }

    // Backup current value before altering
    if (currentValue.trim()) {
      const backupValue = col === 'serialized_value' ? JSON.stringify(currentValue) : currentValue;
      await client.query(
        `INSERT INTO installation_configs (name, "${col}", created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (name) DO NOTHING`,
        ['dashboard_scripts_backup', backupValue],
      );
      this.logger.log('Backed up existing dashboard_scripts value');
    }

    // Remove only our previous marker (leave third-party scripts untouched)
    const withoutOurs = this.removeOurPreviousScript(currentValue);
    const newPlainValue = withoutOurs.trim()
      ? `${withoutOurs.trim()}\n\n${scriptTag}`
      : scriptTag;

    // Serialize back to JSON if the column is serialized_value
    const newValue = col === 'serialized_value' ? JSON.stringify(newPlainValue) : newPlainValue;

    if (existing.rows.length > 0) {
      await client.query(
        `UPDATE installation_configs SET "${col}" = $1, updated_at = NOW() WHERE name = 'dashboard_scripts'`,
        [newValue],
      );
    } else {
      await client.query(
        `INSERT INTO installation_configs (name, "${col}", created_at, updated_at) VALUES ('dashboard_scripts', $1, NOW(), NOW())`,
        [newValue],
      );
    }

    this.logger.log(`Dashboard script injected: https://${domain}/dashboard-script`);
  }

  private removeOurPreviousScript(value: string): string {
    // Remove everything from our marker to the end of the script tag
    const markerIndex = value.indexOf(SCRIPT_MARKER);
    if (markerIndex === -1) return value;

    const before = value.substring(0, markerIndex).trimEnd();
    const after = value.substring(markerIndex);
    const scriptEndIndex = after.indexOf('</script>');
    const remaining = scriptEndIndex !== -1 ? after.substring(scriptEndIndex + '</script>'.length).trimStart() : '';

    return remaining ? `${before}\n${remaining}` : before;
  }
}
