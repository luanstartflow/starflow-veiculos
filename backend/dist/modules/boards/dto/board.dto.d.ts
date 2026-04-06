export declare class CreateBoardDto {
    name: string;
}
declare const UpdateBoardDto_base: import("@nestjs/common").Type<Partial<CreateBoardDto>>;
export declare class UpdateBoardDto extends UpdateBoardDto_base {
}
export declare class CreateColumnDto {
    name: string;
    position?: number;
    color?: string;
}
declare const UpdateColumnDto_base: import("@nestjs/common").Type<Partial<CreateColumnDto>>;
export declare class UpdateColumnDto extends UpdateColumnDto_base {
}
export {};
