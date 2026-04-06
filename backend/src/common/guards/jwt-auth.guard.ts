import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    if (process.env.DISABLE_AUTH === 'true') {
      const request = context.switchToHttp().getRequest<Request & { tenantId?: string }>();
      request.tenantId = process.env.DEFAULT_TENANT_ID ?? '';
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: { tenantId: string }; tenantId?: string }>();
    const result = super.canActivate(context);
    if (result instanceof Promise) {
      return result.then((activated) => {
        if (activated) this.attachTenant(request);
        return activated;
      });
    }
    if (result) this.attachTenant(request);
    return result;
  }

  private attachTenant(request: Request & { user?: { tenantId: string }; tenantId?: string }): void {
    if (request.user?.tenantId) {
      request.tenantId = request.user.tenantId;
    }
  }
}
