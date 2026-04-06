export declare class CreateContactDto {
    name: string;
    phone?: string;
    email?: string;
    document?: string;
    address?: Record<string, unknown>;
    chatwootId?: number;
    notes?: string;
}
declare const UpdateContactDto_base: import("@nestjs/common").Type<Partial<CreateContactDto>>;
export declare class UpdateContactDto extends UpdateContactDto_base {
}
export {};
