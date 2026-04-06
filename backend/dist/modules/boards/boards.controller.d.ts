import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto } from './dto/board.dto';
export declare class BoardsController {
    private readonly boards;
    constructor(boards: BoardsService);
    findAll(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<({
        columns: ({
            _count: {
                cards: number;
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
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        columns: ({
            cards: ({
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
            })[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            position: number;
            color: string | null;
            boardId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
    }>;
    create(tenantId: string, dto: CreateBoardDto): import(".prisma/client").Prisma.Prisma__BoardClient<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(tenantId: string, id: string, dto: UpdateBoardDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
    }>;
    addColumn(tenantId: string, id: string, dto: CreateColumnDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        position: number;
        color: string | null;
        boardId: string;
    }>;
    updateColumn(tenantId: string, boardId: string, columnId: string, dto: UpdateColumnDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        position: number;
        color: string | null;
        boardId: string;
    }>;
    removeColumn(tenantId: string, boardId: string, columnId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        position: number;
        color: string | null;
        boardId: string;
    }>;
}
