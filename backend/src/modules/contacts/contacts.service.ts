import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string, search?: string) {
    return this.prisma.contact.findMany({
      where: {
        tenantId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { email: { contains: search, mode: 'insensitive' } },
                { document: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, tenantId },
      include: { cards: { include: { column: { include: { board: true } } } } },
    });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  create(tenantId: string, dto: CreateContactDto) {
    const { address, ...rest } = dto;
    return this.prisma.contact.create({
      data: { ...rest, tenantId, ...(address !== undefined && { address: address as Prisma.InputJsonValue }) },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateContactDto) {
    await this.findOne(tenantId, id);
    const { address, ...rest } = dto;
    return this.prisma.contact.update({
      where: { id },
      data: { ...rest, ...(address !== undefined && { address: address as Prisma.InputJsonValue }) },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.contact.delete({ where: { id } });
  }
}
