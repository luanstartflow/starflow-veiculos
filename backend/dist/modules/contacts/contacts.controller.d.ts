import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
export declare class ContactsController {
    private readonly contacts;
    constructor(contacts: ContactsService);
    findAll(tenantId: string, search?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        cards: ({
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
        phone: string | null;
        email: string | null;
        document: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        chatwootId: number | null;
        notes: string | null;
    }>;
    create(tenantId: string, dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(tenantId: string, id: string, dto: UpdateContactDto): Promise<{
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
    }>;
    remove(tenantId: string, id: string): Promise<{
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
    }>;
}
