import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        userId: string;
        email: string;
        tenantId: string;
        role: string;
    }>;
    login(tenantSlug: string, dto: LoginDto): Promise<{
        accessToken: string;
        userId: string;
        email: string;
        tenantId: string;
        role: string;
    }>;
}
