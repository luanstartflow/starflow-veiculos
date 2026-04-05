import { Processor, WorkerHost } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as crypto from 'crypto';
import { PrismaService } from '../../../database/prisma.service';
import { WEBHOOK_QUEUE } from '../../webhooks/webhooks.controller';

interface WebhookJob {
  tenantSlug: string;
  payload: Record<string, unknown>;
  signature?: string;
  rawBody?: string;
}

@Processor(WEBHOOK_QUEUE)
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<WebhookJob>): Promise<void> {
    const { tenantSlug, payload, signature, rawBody } = job.data;

    const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant || !tenant.active) {
      this.logger.warn(`Webhook received for unknown/inactive tenant: ${tenantSlug}`);
      return;
    }

    // ── Signature validation ────────────────────────────────────────────────
    if (tenant.webhookSecret) {
      if (!signature || !rawBody) {
        this.logger.warn(`Missing signature for tenant ${tenantSlug} — dropping event`);
        return;
      }
      const expected = 'sha256=' + crypto
        .createHmac('sha256', tenant.webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        this.logger.warn(`Invalid webhook signature for tenant ${tenantSlug} — dropping event`);
        return;
      }
    }

    const eventType = (payload.event as string) ?? 'unknown';

    // Persist event record BEFORE processing so we always have a trace
    const event = await this.prisma.webhookEvent.create({
      data: {
        tenantId: tenant.id,
        type: eventType,
        payload,
        processed: false,
      },
    });

    try {
      await this.handleEvent(tenant.id, eventType, payload);

      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });
    } catch (err) {
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { error: (err as Error).message },
      });
      this.logger.error(`Failed to process webhook ${eventType} for tenant ${tenantSlug}`, err);
      throw err; // Let BullMQ retry
    }
  }

  private async handleEvent(
    tenantId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    switch (eventType) {
      case 'conversation_created':
        await this.onConversationCreated(tenantId, payload);
        break;
      case 'conversation_status_changed':
        await this.onConversationStatusChanged(tenantId, payload);
        break;
      case 'contact_created':
        await this.onContactCreated(tenantId, payload);
        break;
      default:
        this.logger.debug(`Unhandled event type: ${eventType}`);
    }
  }

  private async onConversationCreated(tenantId: string, payload: Record<string, unknown>): Promise<void> {
    const conversationId = payload.id as number | undefined;
    if (!conversationId) return;

    // Skip if card already exists for this conversation
    const existing = await this.prisma.card.findFirst({
      where: { tenantId, chatwootConversationId: conversationId },
    });
    if (existing) return;

    const firstBoard = await this.prisma.board.findFirst({
      where: { tenantId, active: true },
      include: { columns: { orderBy: { position: 'asc' }, take: 1 } },
    });
    if (!firstBoard || firstBoard.columns.length === 0) return;

    const meta = payload.meta as Record<string, unknown> | undefined;
    const contactName = (meta?.sender as Record<string, unknown>)?.name as string | undefined;

    await this.prisma.card.create({
      data: {
        tenantId,
        columnId: firstBoard.columns[0].id,
        title: contactName ? `Conversa com ${contactName}` : `Conversa #${conversationId}`,
        chatwootConversationId: conversationId,
        position: 0,
      },
    });

    this.logger.log(`Auto-created card for conversation #${conversationId}`);
  }

  private async onConversationStatusChanged(tenantId: string, payload: Record<string, unknown>): Promise<void> {
    const conversationId = payload.id as number | undefined;
    if (!conversationId) return;

    const status = payload.status as string | undefined;
    if (status !== 'resolved') return;

    const card = await this.prisma.card.findFirst({
      where: { tenantId, chatwootConversationId: conversationId },
      include: {
        column: {
          include: {
            board: {
              include: { columns: { orderBy: { position: 'desc' }, take: 1 } },
            },
          },
        },
      },
    });
    if (!card) return;

    const lastColumn = card.column.board.columns[0];
    if (lastColumn && lastColumn.id !== card.columnId) {
      await this.prisma.card.update({
        where: { id: card.id },
        data: { columnId: lastColumn.id },
      });
    }
  }

  private async onContactCreated(tenantId: string, payload: Record<string, unknown>): Promise<void> {
    const chatwootId = payload.id as number | undefined;
    if (!chatwootId) return;

    const existing = await this.prisma.contact.findFirst({ where: { tenantId, chatwootId } });
    if (existing) return;

    await this.prisma.contact.create({
      data: {
        tenantId,
        chatwootId,
        name: (payload.name as string) ?? 'Desconhecido',
        phone: payload.phone_number as string | undefined,
        email: payload.email as string | undefined,
      },
    });
  }
}
