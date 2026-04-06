import { Response } from 'express';
import { ContractsService } from './contracts.service';
import { CreateContractDto, UpdateContractDto } from './dto/contract.dto';
export declare class ContractsController {
    private readonly contracts;
    constructor(contracts: ContractsService);
    findAll(tenantId: string, cardId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        card: {
            contact: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                phone: string | null;
                email: string | null;
                document: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                chatwootId: number | null;
                notes: string | null;
            } | null;
            vehicle: {
                id: string;
                tenantId: string;
                status: import(".prisma/client").$Enums.VehicleStatus;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                brand: string;
                model: string;
                year: number;
                plate: string | null;
                color: string | null;
                mileage: number | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                photos: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            columnId: string;
            contactId: string | null;
            vehicleId: string | null;
            assigneeId: string | null;
            title: string;
            description: string | null;
            position: number;
            value: import("@prisma/client/runtime/library").Decimal | null;
            dueDate: Date | null;
            chatwootConversationId: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        number: string;
        id: string;
        tenantId: string;
        cardId: string;
        template: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        tenant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            domain: string | null;
            webhookSecret: string | null;
            active: boolean;
        };
        card: {
            contact: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                phone: string | null;
                email: string | null;
                document: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                chatwootId: number | null;
                notes: string | null;
            } | null;
            vehicle: {
                id: string;
                tenantId: string;
                status: import(".prisma/client").$Enums.VehicleStatus;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                brand: string;
                model: string;
                year: number;
                plate: string | null;
                color: string | null;
                mileage: number | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                photos: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            columnId: string;
            contactId: string | null;
            vehicleId: string | null;
            assigneeId: string | null;
            title: string;
            description: string | null;
            position: number;
            value: import("@prisma/client/runtime/library").Decimal | null;
            dueDate: Date | null;
            chatwootConversationId: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        number: string;
        id: string;
        tenantId: string;
        cardId: string;
        template: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    downloadPdf(tenantId: string, id: string, res: Response): Promise<void>;
    create(tenantId: string, dto: CreateContractDto): Promise<{
        number: string;
        id: string;
        tenantId: string;
        cardId: string;
        template: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateContractDto): Promise<{
        number: string;
        id: string;
        tenantId: string;
        cardId: string;
        template: string;
        content: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
