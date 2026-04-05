import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string, status?: VehicleStatus, search?: string) {
    return this.prisma.vehicle.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { brand: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
                { plate: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, tenantId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  create(tenantId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data: { ...dto, tenantId } });
  }

  async update(tenantId: string, id: string, dto: UpdateVehicleDto) {
    await this.findOne(tenantId, id);
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
