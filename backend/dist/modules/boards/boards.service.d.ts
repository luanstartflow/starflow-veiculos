import { PrismaService } from '../../database/prisma.service';
import { CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto } from './dto/board.dto';
export declare class BoardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<({
        columns: ({
            _count: {
                cards: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            position: number;
            boardId: string;
            color: string | null;
        })[];
    } & {
        name: string;
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        columns: ({
            cards: ({
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
                assignee: {
                    name: string;
                    email: string;
                    id: string;
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
            })[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            position: number;
            boardId: string;
            color: string | null;
        })[];
    } & {
        name: string;
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    create(tenantId: string, dto: CreateBoardDto): import(".prisma/client").Prisma.Prisma__BoardClient<{
        name: string;
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(tenantId: string, id: string, dto: UpdateBoardDto): Promise<{
        name: string;
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    addColumn(tenantId: string, boardId: string, dto: CreateColumnDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        position: number;
        boardId: string;
        color: string | null;
    }>;
    updateColumn(tenantId: string, boardId: string, columnId: string, dto: UpdateColumnDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        position: number;
        boardId: string;
        color: string | null;
    }>;
    removeColumn(tenantId: string, boardId: string, columnId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        position: number;
        boardId: string;
        color: string | null;
    }>;
}
