import { PrismaService } from '../../database/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        domain: string | null;
        id: string;
        slug: string;
        webhookSecret: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        domain: string | null;
        id: string;
        slug: string;
        webhookSecret: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateTenantDto): import(".prisma/client").Prisma.Prisma__TenantClient<{
        name: string;
        domain: string | null;
        id: string;
        slug: string;
        webhookSecret: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateTenantDto): Promise<{
        name: string;
        domain: string | null;
        id: string;
        slug: string;
        webhookSecret: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    stats(tenantId: string): Promise<{
        contacts: number;
        vehicles: number;
        boards: number;
        cards: number;
    }>;
}
