import { VehicleStatus } from '@prisma/client';
export declare class CreateVehicleDto {
    brand: string;
    model: string;
    year: number;
    plate?: string;
    color?: string;
    mileage?: number;
    price?: number;
    status?: VehicleStatus;
    photos?: string[];
    description?: string;
}
declare const UpdateVehicleDto_base: import("@nestjs/common").Type<Partial<CreateVehicleDto>>;
export declare class UpdateVehicleDto extends UpdateVehicleDto_base {
}
export {};
