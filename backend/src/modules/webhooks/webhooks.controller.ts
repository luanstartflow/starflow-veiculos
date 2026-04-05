import {
  Controller,
  Post,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectQueue } from 'bullmq';
import { Queue } from 'bullmq';
import { Request } from 'express';

export const WEBHOOK_QUEUE = 'webhooks';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    @InjectQueue(WEBHOOK_QUEUE) private readonly queue: Queue,
  ) {}

  @Post(':tenantSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive Chatwoot webhook events' })
  async receive(
    @Req() req: Request & { rawBody?: Buffer },
    @Param('tenantSlug') tenantSlug: string,
    @Body() payload: Record<string, unknown>,
    @Headers('x-chatwoot-signature') signature?: string,
  ) {
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : undefined;

    await this.queue.add(
      'process-webhook',
      { tenantSlug, payload, signature, rawBody },
      { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
    );
    return { received: true };
  }
}
