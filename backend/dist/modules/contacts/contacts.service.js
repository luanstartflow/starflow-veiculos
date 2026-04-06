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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ContactsService = class ContactsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(tenantId, search) {
        return this.prisma.contact.findMany({
            where: {
                tenantId,
                ...(search
                    ? {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { phone: { contains: search } },
                            { email: { contains: search, mode: 'insensitive' } },
                            { document: { contains: search } },
                        ],
                    }
                    : {}),
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const contact = await this.prisma.contact.findFirst({
            where: { id, tenantId },
            include: { cards: { include: { column: { include: { board: true } } } } },
        });
        if (!contact)
            throw new common_1.NotFoundException('Contact not found');
        return contact;
    }
    create(tenantId, dto) {
        const { address, ...rest } = dto;
        return this.prisma.contact.create({
            data: { ...rest, tenantId, ...(address !== undefined && { address: address }) },
        });
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        const { address, ...rest } = dto;
        return this.prisma.contact.update({
            where: { id },
            data: { ...rest, ...(address !== undefined && { address: address }) },
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.contact.delete({ where: { id } });
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map