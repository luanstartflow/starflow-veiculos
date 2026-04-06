import { Queue } from 'bullmq';
import { Request } from 'express';
export declare const WEBHOOK_QUEUE = "webhooks";
export declare class WebhooksController {
    private readonly queue;
    constructor(queue: Queue);
    receive(req: Request & {
        rawBody?: Buffer;
    }, tenantSlug: string, payload: Record<string, unknown>, signature?: string): Promise<{
        received: boolean;
    }>;
}
