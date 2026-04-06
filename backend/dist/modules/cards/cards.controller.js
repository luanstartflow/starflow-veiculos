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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cards_service_1 = require("./cards.service");
const card_dto_1 = require("./dto/card.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
let CardsController = class CardsController {
    constructor(cards) {
        this.cards = cards;
    }
    findAll(tenantId, columnId, chatwootConversationId) {
        return this.cards.findAll(tenantId, columnId, chatwootConversationId ? parseInt(chatwootConversationId, 10) : undefined);
    }
    findOne(tenantId, id) {
        return this.cards.findOne(tenantId, id);
    }
    create(tenantId, dto) {
        return this.cards.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.cards.update(tenantId, id, dto);
    }
    move(tenantId, id, dto) {
        return this.cards.move(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.cards.remove(tenantId, id);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'columnId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'chatwootConversationId', required: false }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('columnId')),
    __param(2, (0, common_1.Query)('chatwootConversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, card_dto_1.CreateCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Move card to another column/position' }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, card_dto_1.MoveCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "move", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "remove", null);
exports.CardsController = CardsController = __decorate([
    (0, swagger_1.ApiTags)('Cards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map