import { PrismaService } from '../../database/prisma.service';
import { CreateContractDto, UpdateContractDto } from './dto/contract.dto';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, cardId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        card: {
            contact: {
                name: string;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                phone: string | null;
                document: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                chatwootId: number | null;
                notes: string | null;
            } | null;
            vehicle: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                color: string | null;
                brand: string;
                model: string;
                year: number;
                plate: string | null;
                mileage: number | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                status: import(".prisma/client").$Enums.VehicleStatus;
                photos: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        } & {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            columnId: string;
            contactId: string | null;
            vehicleId: string | null;
            assigneeId: string | null;
            position: number;
            value: import("@prisma/client/runtime/library").Decimal | null;
            dueDate: Date | null;
            chatwootConversationId: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        cardId: string;
        template: string;
        signedAt: Date | null;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        tenant: {
            name: string;
            domain: string | null;
            id: string;
            slug: string;
            webhookSecret: string | null;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        card: {
            contact: {
                name: string;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                phone: string | null;
                document: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                chatwootId: number | null;
                notes: string | null;
            } | null;
            vehicle: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                color: string | null;
                brand: string;
                model: string;
                year: number;
                plate: string | null;
                mileage: number | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                status: import(".prisma/client").$Enums.VehicleStatus;
                photos: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        } & {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            columnId: string;
            contactId: string | null;
            vehicleId: string | null;
            assigneeId: string | null;
            position: number;
            value: import("@prisma/client/runtime/library").Decimal | null;
            dueDate: Date | null;
            chatwootConversationId: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        cardId: string;
        template: string;
        signedAt: Date | null;
    }>;
    create(tenantId: string, dto: CreateContractDto): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        cardId: string;
        template: string;
        signedAt: Date | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateContractDto): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        cardId: string;
        template: string;
        signedAt: Date | null;
    }>;
    generatePdf(tenantId: string, id: string): Promise<Buffer>;
    private renderTemplate;
    private buildPdf;
    private pdfSection;
    private pdfRow;
}
