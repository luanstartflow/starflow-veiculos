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
var WebhookProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const prisma_service_1 = require("../../../database/prisma.service");
const webhooks_controller_1 = require("../../webhooks/webhooks.controller");
let WebhookProcessor = WebhookProcessor_1 = class WebhookProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhookProcessor_1.name);
    }
    async process(job) {
        const { tenantSlug, payload, signature, rawBody } = job.data;
        const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
        if (!tenant || !tenant.active) {
            this.logger.warn(`Webhook received for unknown/inactive tenant: ${tenantSlug}`);
            return;
        }
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
        const eventType = payload.event ?? 'unknown';
        const event = await this.prisma.webhookEvent.create({
            data: {
                tenantId: tenant.id,
                type: eventType,
                payload: payload,
                processed: false,
            },
        });
        try {
            await this.handleEvent(tenant.id, eventType, payload);
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: { processed: true },
            });
        }
        catch (err) {
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: { error: err.message },
            });
            this.logger.error(`Failed to process webhook ${eventType} for tenant ${tenantSlug}`, err);
            throw err;
        }
    }
    async handleEvent(tenantId, eventType, payload) {
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
    async onConversationCreated(tenantId, payload) {
        const conversationId = payload.id;
        if (!conversationId)
            return;
        const existing = await this.prisma.card.findFirst({
            where: { tenantId, chatwootConversationId: conversationId },
        });
        if (existing)
            return;
        const firstBoard = await this.prisma.board.findFirst({
            where: { tenantId, active: true },
            include: { columns: { orderBy: { position: 'asc' }, take: 1 } },
        });
        if (!firstBoard || firstBoard.columns.length === 0)
            return;
        const meta = payload.meta;
        const contactName = meta?.sender?.name;
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
    async onConversationStatusChanged(tenantId, payload) {
        const conversationId = payload.id;
        if (!conversationId)
            return;
        const status = payload.status;
        if (status !== 'resolved')
            return;
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
        if (!card)
            return;
        const lastColumn = card.column.board.columns[0];
        if (lastColumn && lastColumn.id !== card.columnId) {
            await this.prisma.card.update({
                where: { id: card.id },
                data: { columnId: lastColumn.id },
            });
        }
    }
    async onContactCreated(tenantId, payload) {
        const chatwootId = payload.id;
        if (!chatwootId)
            return;
        const existing = await this.prisma.contact.findFirst({ where: { tenantId, chatwootId } });
        if (existing)
            return;
        await this.prisma.contact.create({
            data: {
                tenantId,
                chatwootId,
                name: payload.name ?? 'Desconhecido',
                phone: payload.phone_number,
                email: payload.email,
            },
        });
    }
};
exports.WebhookProcessor = WebhookProcessor;
exports.WebhookProcessor = WebhookProcessor = WebhookProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(webhooks_controller_1.WEBHOOK_QUEUE),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookProcessor);
//# sourceMappingURL=webhook.processor.js.map