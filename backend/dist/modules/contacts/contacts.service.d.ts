import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
export declare class ContactsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, search?: string): Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        email: string | null;
        document: string | null;
        address: Prisma.JsonValue | null;
        chatwootId: number | null;
        notes: string | null;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        cards: ({
            column: {
                board: {
                    name: string;
                    id: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            columnId: string;
            contactId: string | null;
            vehicleId: string | null;
            assigneeId: string | null;
            title: string;
            description: string | null;
            position: number;
            value: Prisma.Decimal | null;
            dueDate: Date | null;
            chatwootConversationId: number | null;
            metadata: Prisma.JsonValue | null;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        email: string | null;
        document: string | null;
        address: Prisma.JsonValue | null;
        chatwootId: number | null;
        notes: string | null;
    }>;
    create(tenantId: string, dto: CreateContactDto): Prisma.Prisma__ContactClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        email: string | null;
        document: string | null;
        address: Prisma.JsonValue | null;
        chatwootId: number | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(tenantId: string, id: string, dto: UpdateContactDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        email: string | null;
        document: string | null;
        address: Prisma.JsonValue | null;
        chatwootId: number | null;
        notes: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        email: string | null;
        document: string | null;
        address: Prisma.JsonValue | null;
        chatwootId: number | null;
        notes: string | null;
    }>;
}
