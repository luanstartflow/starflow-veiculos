import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Column (stage) ID' })
  @IsUUID()
  columnId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  contactId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Chatwoot conversation ID' })
  @IsInt()
  @IsOptional()
  chatwootConversationId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}

export class MoveCardDto {
  @ApiProperty({ description: 'Target column ID' })
  @IsUUID()
  columnId: string;

  @ApiProperty({ description: 'New position (0-indexed)', default: 0 })
  @IsInt()
  @Min(0)
  position: number;
}
