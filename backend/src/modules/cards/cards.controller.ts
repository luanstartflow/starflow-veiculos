import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Get()
  @ApiQuery({ name: 'columnId', required: false })
  @ApiQuery({ name: 'chatwootConversationId', required: false })
  findAll(
    @TenantId() tenantId: string,
    @Query('columnId') columnId?: string,
    @Query('chatwootConversationId') chatwootConversationId?: string,
  ) {
    return this.cards.findAll(
      tenantId,
      columnId,
      chatwootConversationId ? parseInt(chatwootConversationId, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.cards.findOne(tenantId, id);
  }

  @Post()
  create(@TenantId() tenantId: string, @Body() dto: CreateCardDto) {
    return this.cards.create(tenantId, dto);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: UpdateCardDto) {
    return this.cards.update(tenantId, id, dto);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move card to another column/position' })
  move(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: MoveCardDto) {
    return this.cards.move(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.cards.remove(tenantId, id);
  }
}
