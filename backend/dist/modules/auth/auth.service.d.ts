import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        userId: string;
        email: string;
        tenantId: string;
        role: string;
    }>;
    login(dto: LoginDto, tenantSlug: string): Promise<{
        accessToken: string;
        userId: string;
        email: string;
        tenantId: string;
        role: string;
    }>;
    private buildTokenResponse;
}
