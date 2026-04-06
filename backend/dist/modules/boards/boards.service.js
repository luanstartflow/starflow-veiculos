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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let BoardsService = class BoardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(tenantId) {
        return this.prisma.board.findMany({
            where: { tenantId, active: true },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        _count: { select: { cards: true } },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const board = await this.prisma.board.findFirst({
            where: { id, tenantId },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        cards: {
                            orderBy: { position: 'asc' },
                            include: {
                                contact: true,
                                vehicle: true,
                                assignee: { select: { id: true, name: true, email: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!board)
            throw new common_1.NotFoundException('Board not found');
        return board;
    }
    create(tenantId, dto) {
        return this.prisma.board.create({ data: { ...dto, tenantId } });
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        return this.prisma.board.update({ where: { id }, data: dto });
    }
    async addColumn(tenantId, boardId, dto) {
        await this.findOne(tenantId, boardId);
        const lastCol = await this.prisma.column.findFirst({
            where: { boardId },
            orderBy: { position: 'desc' },
        });
        return this.prisma.column.create({
            data: {
                ...dto,
                boardId,
                tenantId,
                position: dto.position ?? (lastCol ? lastCol.position + 1 : 0),
            },
        });
    }
    async updateColumn(tenantId, boardId, columnId, dto) {
        const col = await this.prisma.column.findFirst({ where: { id: columnId, boardId, tenantId } });
        if (!col)
            throw new common_1.NotFoundException('Column not found');
        return this.prisma.column.update({ where: { id: columnId }, data: dto });
    }
    async removeColumn(tenantId, boardId, columnId) {
        const col = await this.prisma.column.findFirst({ where: { id: columnId, boardId, tenantId } });
        if (!col)
            throw new common_1.NotFoundException('Column not found');
        return this.prisma.column.delete({ where: { id: columnId } });
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map