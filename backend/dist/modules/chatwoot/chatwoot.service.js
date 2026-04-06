"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatwootService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatwootService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
const SCRIPT_MARKER = '<!-- GlobalVeiculos KanbanCW -->';
let ChatwootService = ChatwootService_1 = class ChatwootService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(ChatwootService_1.name);
    }
    async onModuleInit() {
        try {
            await this.injectDashboardScript();
        }
        catch (err) {
            this.logger.error('Failed to inject dashboard script into Chatwoot', err);
        }
    }
    async injectDashboardScript() {
        const chatwootDbUrl = this.config.get('chatwootDatabaseUrl');
        const kanbancwDomain = this.config.get('kanbancwDomain');
        if (!chatwootDbUrl || !kanbancwDomain) {
            this.logger.warn('CHATWOOT_DATABASE_URL or KANBANCW_DOMAIN not set — skipping script injection');
            return;
        }
        const client = new pg_1.Client({ connectionString: chatwootDbUrl });
        try {
            await client.connect();
            this.logger.log('Connected to Chatwoot database');
            await this.validateChatwootSchema(client);
            await this.upsertDashboardScript(client, kanbancwDomain);
        }
        finally {
            await client.end();
        }
    }
    async validateChatwootSchema(client) {
        const result = await client.query(`
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
    async upsertDashboardScript(client, domain) {
        const scriptTag = `${SCRIPT_MARKER}\n<script src="https://${domain}/dashboard-script" defer></script>`;
        const existing = await client.query(`SELECT value FROM installation_configs WHERE name = 'dashboard_scripts' LIMIT 1`);
        const currentValue = existing.rows[0]?.value ?? '';
        if (currentValue.includes(scriptTag)) {
            this.logger.log('Dashboard script already injected and up-to-date');
            return;
        }
        if (currentValue.trim()) {
            await client.query(`INSERT INTO installation_configs (name, value, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (name) DO NOTHING`, ['dashboard_scripts_backup', currentValue]);
            this.logger.log('Backed up existing dashboard_scripts value');
        }
        const withoutOurs = this.removeOurPreviousScript(currentValue);
        const newValue = withoutOurs.trim()
            ? `${withoutOurs.trim()}\n\n${scriptTag}`
            : scriptTag;
        if (existing.rows.length > 0) {
            await client.query(`UPDATE installation_configs SET value = $1, updated_at = NOW() WHERE name = 'dashboard_scripts'`, [newValue]);
        }
        else {
            await client.query(`INSERT INTO installation_configs (name, value, created_at, updated_at) VALUES ('dashboard_scripts', $1, NOW(), NOW())`, [newValue]);
        }
        this.logger.log(`Dashboard script injected: https://${domain}/dashboard-script`);
    }
    removeOurPreviousScript(value) {
        const markerIndex = value.indexOf(SCRIPT_MARKER);
        if (markerIndex === -1)
            return value;
        const before = value.substring(0, markerIndex).trimEnd();
        const after = value.substring(markerIndex);
        const scriptEndIndex = after.indexOf('</script>');
        const remaining = scriptEndIndex !== -1 ? after.substring(scriptEndIndex + '</script>'.length).trimStart() : '';
        return remaining ? `${before}\n${remaining}` : before;
    }
};
exports.ChatwootService = ChatwootService;
exports.ChatwootService = ChatwootService = ChatwootService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatwootService);
//# sourceMappingURL=chatwoot.service.js.map