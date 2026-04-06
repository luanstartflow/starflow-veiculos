import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';
export declare class CardsController {
    private readonly cards;
    constructor(cards: CardsService);
    findAll(tenantId: string, columnId?: string, chatwootConversationId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        column: {
            id: string;
            name: string;
            boardId: string;
        };
        assignee: {
            id: string;
            name: string;
            email: string;
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
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
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
        column: {
            board: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            position: number;
            color: string | null;
            boardId: string;
        };
        assignee: {
            id: string;
            name: string;
            email: string;
        } | null;
        contracts: {
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
        }[];
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
    }>;
    create(tenantId: string, dto: CreateCardDto): Promise<{
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
    }>;
    update(tenantId: string, id: string, dto: UpdateCardDto): Promise<{
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
        assignee: {
            id: string;
            name: string;
            email: string;
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
    }>;
    move(tenantId: string, id: string, dto: MoveCardDto): Promise<{
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
    }>;
    remove(tenantId: string, id: string): Promise<{
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
    }>;
}
