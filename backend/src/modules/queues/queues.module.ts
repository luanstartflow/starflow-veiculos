import { Module } from '@nestjs/common';
import { BullModule } from 'bullmq';
import { WebhookProcessor } from './processors/webhook.processor';
import { PrismaService } from '../../database/prisma.service';
import { WEBHOOK_QUEUE } from '../webhooks/webhooks.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: WEBHOOK_QUEUE }),
  ],
  providers: [WebhookProcessor, PrismaService],
})
export class QueuesModule {}
