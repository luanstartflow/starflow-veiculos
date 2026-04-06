import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../../database/prisma.service';
export declare class HealthController {
    private readonly health;
    private readonly prismaHealth;
    private readonly prisma;
    constructor(health: HealthCheckService, prismaHealth: PrismaHealthIndicator, prisma: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
