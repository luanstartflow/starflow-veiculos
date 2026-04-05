import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Tenant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenant')
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current tenant info' })
  findOne(@TenantId() tenantId: string) {
    return this.tenants.findOne(tenantId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get tenant statistics' })
  stats(@TenantId() tenantId: string) {
    return this.tenants.stats(tenantId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update tenant settings' })
  update(@TenantId() tenantId: string, @Body() dto: UpdateTenantDto) {
    return this.tenants.update(tenantId, dto);
  }
}
