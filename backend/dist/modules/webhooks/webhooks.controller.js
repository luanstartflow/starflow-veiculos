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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = exports.WEBHOOK_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
exports.WEBHOOK_QUEUE = 'webhooks';
let WebhooksController = class WebhooksController {
    constructor(queue) {
        this.queue = queue;
    }
    async receive(req, tenantSlug, payload, signature) {
        const rawBody = req.rawBody ? req.rawBody.toString('utf8') : undefined;
        await this.queue.add('process-webhook', { tenantSlug, payload, signature, rawBody }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
        return { received: true };
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)(':tenantSlug'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Receive Chatwoot webhook events' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('tenantSlug')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('x-chatwoot-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "receive", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __param(0, (0, bullmq_1.InjectQueue)(exports.WEBHOOK_QUEUE)),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map