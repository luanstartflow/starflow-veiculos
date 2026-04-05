import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new tenant + admin user' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post(':tenantSlug/login')
  @ApiOperation({ summary: 'Login within a tenant' })
  login(@Param('tenantSlug') tenantSlug: string, @Body() dto: LoginDto) {
    return this.auth.login(dto, tenantSlug);
  }
}
