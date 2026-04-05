import { IsString, IsOptional, IsInt, Min, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}

export class CreateColumnDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateColumnDto extends PartialType(CreateColumnDto) {}
