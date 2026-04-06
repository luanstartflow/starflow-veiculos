import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsController {
    private readonly tenants;
    constructor(tenants: TenantsService);
    findOne(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        domain: string | null;
        webhookSecret: string | null;
        active: boolean;
    }>;
    stats(tenantId: string): Promise<{
        contacts: number;
        vehicles: number;
        boards: number;
        cards: number;
    }>;
    update(tenantId: string, dto: UpdateTenantDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        domain: string | null;
        webhookSecret: string | null;
        active: boolean;
    }>;
}
