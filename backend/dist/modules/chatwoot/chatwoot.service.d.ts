import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class ChatwootService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    injectDashboardScript(): Promise<void>;
    private validateChatwootSchema;
    private upsertDashboardScript;
    private removeOurPreviousScript;
}
