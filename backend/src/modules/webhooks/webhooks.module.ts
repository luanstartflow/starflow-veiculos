import { Module } from '@nestjs/common';
import { BullModule } from 'bullmq';
import { WebhooksController } from './webhooks.controller';
import { WEBHOOK_QUEUE } from './webhooks.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: WEBHOOK_QUEUE }),
  ],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
