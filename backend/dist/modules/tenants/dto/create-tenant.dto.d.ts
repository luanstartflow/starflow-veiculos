export declare class CreateTenantDto {
    name: string;
    slug: string;
    domain?: string;
}
export declare class UpdateTenantDto {
    name?: string;
    domain?: string;
    active?: boolean;
}
