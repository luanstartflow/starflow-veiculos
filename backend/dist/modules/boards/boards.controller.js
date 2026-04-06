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
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const boards_service_1 = require("./boards.service");
const board_dto_1 = require("./dto/board.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
let BoardsController = class BoardsController {
    constructor(boards) {
        this.boards = boards;
    }
    findAll(tenantId) {
        return this.boards.findAll(tenantId);
    }
    findOne(tenantId, id) {
        return this.boards.findOne(tenantId, id);
    }
    create(tenantId, dto) {
        return this.boards.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.boards.update(tenantId, id, dto);
    }
    addColumn(tenantId, id, dto) {
        return this.boards.addColumn(tenantId, id, dto);
    }
    updateColumn(tenantId, boardId, columnId, dto) {
        return this.boards.updateColumn(tenantId, boardId, columnId, dto);
    }
    removeColumn(tenantId, boardId, columnId) {
        return this.boards.removeColumn(tenantId, boardId, columnId);
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, board_dto_1.CreateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, board_dto_1.UpdateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/columns'),
    (0, swagger_1.ApiOperation)({ summary: 'Add column to board' }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, board_dto_1.CreateColumnDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "addColumn", null);
__decorate([
    (0, common_1.Patch)(':id/columns/:columnId'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('columnId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, board_dto_1.UpdateColumnDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "updateColumn", null);
__decorate([
    (0, common_1.Delete)(':id/columns/:columnId'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('columnId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "removeColumn", null);
exports.BoardsController = BoardsController = __decorate([
    (0, swagger_1.ApiTags)('Boards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('boards'),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map