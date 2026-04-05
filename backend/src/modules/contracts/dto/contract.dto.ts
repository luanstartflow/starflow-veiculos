import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';

export class CreateContractDto {
  @ApiProperty()
  @IsUUID()
  cardId: string;

  @ApiProperty({ description: 'Contract number/reference' })
  @IsString()
  number: string;

  @ApiProperty({ description: 'Template name identifier' })
  @IsString()
  template: string;

  @ApiPropertyOptional({ description: 'Rendered contract HTML content' })
  @IsString()
  @IsOptional()
  content?: string;
}

export class UpdateContractDto {
  @ApiPropertyOptional({ enum: ContractStatus })
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
}
