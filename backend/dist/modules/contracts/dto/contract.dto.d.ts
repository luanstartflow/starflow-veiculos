import { ContractStatus } from '@prisma/client';
export declare class CreateContractDto {
    cardId: string;
    number: string;
    template: string;
    content?: string;
}
export declare class UpdateContractDto {
    status?: ContractStatus;
    content?: string;
}
