export declare class CreateCardDto {
    title: string;
    columnId: string;
    description?: string;
    contactId?: string;
    vehicleId?: string;
    assigneeId?: string;
    value?: number;
    dueDate?: string;
    chatwootConversationId?: number;
    metadata?: Record<string, unknown>;
}
declare const UpdateCardDto_base: import("@nestjs/common").Type<Partial<CreateCardDto>>;
export declare class UpdateCardDto extends UpdateCardDto_base {
}
export declare class MoveCardDto {
    columnId: string;
    position: number;
}
export {};
