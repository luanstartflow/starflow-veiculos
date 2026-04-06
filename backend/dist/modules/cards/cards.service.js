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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CardsService = class CardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(tenantId, columnId, chatwootConversationId) {
        return this.prisma.card.findMany({
            where: {
                tenantId,
                ...(columnId ? { columnId } : {}),
                ...(chatwootConversationId ? { chatwootConversationId } : {}),
            },
            include: {
                contact: true,
                vehicle: true,
                assignee: { select: { id: true, name: true, email: true } },
                column: { select: { id: true, name: true, boardId: true } },
            },
            orderBy: [{ columnId: 'asc' }, { position: 'asc' }],
        });
    }
    async findOne(tenantId, id) {
        const card = await this.prisma.card.findFirst({
            where: { id, tenantId },
            include: {
                contact: true,
                vehicle: true,
                assignee: { select: { id: true, name: true, email: true } },
                column: { include: { board: true } },
                contracts: true,
            },
        });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        return card;
    }
    async create(tenantId, dto) {
        const column = await this.prisma.column.findFirst({
            where: { id: dto.columnId, tenantId },
        });
        if (!column)
            throw new common_1.ForbiddenException('Column not found in this tenant');
        const lastCard = await this.prisma.card.findFirst({
            where: { columnId: dto.columnId },
            orderBy: { position: 'desc' },
        });
        const { metadata, ...rest } = dto;
        return this.prisma.card.create({
            data: {
                ...rest,
                tenantId,
                position: lastCard ? lastCard.position + 1 : 0,
                ...(metadata !== undefined && { metadata: metadata }),
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        const { metadata, ...rest } = dto;
        return this.prisma.card.update({
            where: { id },
            data: {
                ...rest,
                ...(metadata !== undefined && { metadata: metadata }),
            },
            include: {
                contact: true,
                vehicle: true,
                assignee: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async move(tenantId, id, dto) {
        const card = await this.findOne(tenantId, id);
        const targetColumn = await this.prisma.column.findFirst({
            where: { id: dto.columnId, tenantId },
        });
        if (!targetColumn)
            throw new common_1.ForbiddenException('Target column not found in this tenant');
        await this.prisma.card.updateMany({
            where: {
                columnId: dto.columnId,
                position: { gte: dto.position },
                id: { not: id },
            },
            data: { position: { increment: 1 } },
        });
        return this.prisma.card.update({
            where: { id },
            data: { columnId: dto.columnId, position: dto.position },
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.card.delete({ where: { id } });
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CardsService);
//# sourceMappingURL=cards.service.js.map