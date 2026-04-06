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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../database/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const existing = await this.prisma.tenant.findUnique({
            where: { slug: dto.tenantSlug },
        });
        if (existing) {
            throw new common_1.ConflictException('Tenant slug already taken');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const tenant = await this.prisma.tenant.create({
            data: {
                name: dto.tenantName,
                slug: dto.tenantSlug,
                domain: dto.domain,
                users: {
                    create: {
                        email: dto.email,
                        name: dto.name,
                        password: hashedPassword,
                        role: 'ADMIN',
                    },
                },
            },
            include: { users: true },
        });
        const user = tenant.users[0];
        return this.buildTokenResponse(user.id, user.email, user.tenantId, user.role);
    }
    async login(dto, tenantSlug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug: tenantSlug },
        });
        if (!tenant || !tenant.active) {
            throw new common_1.UnauthorizedException('Tenant not found or inactive');
        }
        const user = await this.prisma.user.findUnique({
            where: { tenantId_email: { tenantId: tenant.id, email: dto.email } },
        });
        if (!user || !user.active) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.buildTokenResponse(user.id, user.email, user.tenantId, user.role);
    }
    buildTokenResponse(userId, email, tenantId, role) {
        const payload = { sub: userId, email, tenantId, role };
        return {
            accessToken: this.jwt.sign(payload),
            userId,
            email,
            tenantId,
            role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map