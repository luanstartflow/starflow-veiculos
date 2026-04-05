import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string, columnId?: string, chatwootConversationId?: number) {
    return this.prisma.card.findMany({
      where: {
        tenantId,
        ...(columnId ? { columnId } : {}),
        ...(chatwootConversationId ? { chatwootConversationId } : {}),
      },
      include: {
        contact: true,
        vehicle: true,
        assignee: { select: { id: true, name: true, email: true } },
        column: { select: { id: true, name: true, boardId: true } },
      },
      orderBy: [{ columnId: 'asc' }, { position: 'asc' }],
    });
  }

  async findOne(tenantId: string, id: string) {
    const card = await this.prisma.card.findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        vehicle: true,
        assignee: { select: { id: true, name: true, email: true } },
        column: { include: { board: true } },
        contracts: true,
      },
    });
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async create(tenantId: string, dto: CreateCardDto) {
    // Verify column belongs to tenant
    const column = await this.prisma.column.findFirst({
      where: { id: dto.columnId, tenantId },
    });
    if (!column) throw new ForbiddenException('Column not found in this tenant');

    const lastCard = await this.prisma.card.findFirst({
      where: { columnId: dto.columnId },
      orderBy: { position: 'desc' },
    });

    return this.prisma.card.create({
      data: {
        ...dto,
        tenantId,
        position: lastCard ? lastCard.position + 1 : 0,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateCardDto) {
    await this.findOne(tenantId, id);
    return this.prisma.card.update({
      where: { id },
      data: dto,
      include: {
        contact: true,
        vehicle: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async move(tenantId: string, id: string, dto: MoveCardDto) {
    const card = await this.findOne(tenantId, id);

    // Verify target column belongs to same tenant
    const targetColumn = await this.prisma.column.findFirst({
      where: { id: dto.columnId, tenantId },
    });
    if (!targetColumn) throw new ForbiddenException('Target column not found in this tenant');

    // Shift positions in target column to make room
    await this.prisma.card.updateMany({
      where: {
        columnId: dto.columnId,
        position: { gte: dto.position },
        id: { not: id },
      },
      data: { position: { increment: 1 } },
    });

    return this.prisma.card.update({
      where: { id },
      data: { columnId: dto.columnId, position: dto.position },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.card.delete({ where: { id } });
  }
}
