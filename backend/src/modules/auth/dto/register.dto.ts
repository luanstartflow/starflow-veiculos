import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Concessionária ABC' })
  @IsString()
  tenantName: string;

  @ApiProperty({ example: 'abc' })
  @IsString()
  tenantSlug: string;

  @ApiProperty({ example: 'admin@concessionaria.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Administrador' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'senha123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'kanban.concessionaria.com' })
  @IsString()
  @IsOptional()
  domain?: string;
}
