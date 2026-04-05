import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto } from './dto/board.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boards: BoardsService) {}

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.boards.findAll(tenantId);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.boards.findOne(tenantId, id);
  }

  @Post()
  create(@TenantId() tenantId: string, @Body() dto: CreateBoardDto) {
    return this.boards.create(tenantId, dto);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boards.update(tenantId, id, dto);
  }

  @Post(':id/columns')
  @ApiOperation({ summary: 'Add column to board' })
  addColumn(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: CreateColumnDto) {
    return this.boards.addColumn(tenantId, id, dto);
  }

  @Patch(':id/columns/:columnId')
  updateColumn(
    @TenantId() tenantId: string,
    @Param('id') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.boards.updateColumn(tenantId, boardId, columnId, dto);
  }

  @Delete(':id/columns/:columnId')
  removeColumn(
    @TenantId() tenantId: string,
    @Param('id') boardId: string,
    @Param('columnId') columnId: string,
  ) {
    return this.boards.removeColumn(tenantId, boardId, columnId);
  }
}
