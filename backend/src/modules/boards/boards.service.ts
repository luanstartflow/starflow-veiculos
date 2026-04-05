import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.board.findMany({
      where: { tenantId, active: true },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            _count: { select: { cards: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const board = await this.prisma.board.findFirst({
      where: { id, tenantId },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
              include: {
                contact: true,
                vehicle: true,
                assignee: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  create(tenantId: string, dto: CreateBoardDto) {
    return this.prisma.board.create({ data: { ...dto, tenantId } });
  }

  async update(tenantId: string, id: string, dto: UpdateBoardDto) {
    await this.findOne(tenantId, id);
    return this.prisma.board.update({ where: { id }, data: dto });
  }

  async addColumn(tenantId: string, boardId: string, dto: CreateColumnDto) {
    await this.findOne(tenantId, boardId);
    const lastCol = await this.prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
    });
    return this.prisma.column.create({
      data: {
        ...dto,
        boardId,
        tenantId,
        position: dto.position ?? (lastCol ? lastCol.position + 1 : 0),
      },
    });
  }

  async updateColumn(tenantId: string, boardId: string, columnId: string, dto: UpdateColumnDto) {
    const col = await this.prisma.column.findFirst({ where: { id: columnId, boardId, tenantId } });
    if (!col) throw new NotFoundException('Column not found');
    return this.prisma.column.update({ where: { id: columnId }, data: dto });
  }

  async removeColumn(tenantId: string, boardId: string, columnId: string) {
    const col = await this.prisma.column.findFirst({ where: { id: columnId, boardId, tenantId } });
    if (!col) throw new NotFoundException('Column not found');
    return this.prisma.column.delete({ where: { id: columnId } });
  }
}
