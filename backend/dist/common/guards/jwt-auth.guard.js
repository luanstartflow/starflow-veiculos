"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        if (process.env.DISABLE_AUTH === 'true') {
            const request = context.switchToHttp().getRequest();
            request.tenantId = process.env.DEFAULT_TENANT_ID ?? '';
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const result = super.canActivate(context);
        if (result instanceof Promise) {
            return result.then((activated) => {
                if (activated)
                    this.attachTenant(request);
                return activated;
            });
        }
        if (result)
            this.attachTenant(request);
        return result;
    }
    attachTenant(request) {
        if (request.user?.tenantId) {
            request.tenantId = request.user.tenantId;
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map