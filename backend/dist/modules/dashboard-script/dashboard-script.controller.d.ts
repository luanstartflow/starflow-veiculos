import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class DashboardScriptController {
    private readonly config;
    private readonly kanbancwDomain;
    constructor(config: ConfigService);
    serve(res: Response): void;
    private buildScript;
}
