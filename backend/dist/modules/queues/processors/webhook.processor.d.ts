import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
interface WebhookJob {
    tenantSlug: string;
    payload: Record<string, unknown>;
    signature?: string;
    rawBody?: string;
}
export declare class WebhookProcessor extends WorkerHost {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    process(job: Job<WebhookJob>): Promise<void>;
    private handleEvent;
    private onConversationCreated;
    private onConversationStatusChanged;
    private onContactCreated;
}
export {};
