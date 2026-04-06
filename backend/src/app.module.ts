import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import configuration from './config/configuration';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ChatwootModule } from './modules/chatwoot/chatwoot.module';
import { DashboardScriptModule } from './modules/dashboard-script/dashboard-script.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { BoardsModule } from './modules/boards/boards.module';
import { CardsModule } from './modules/cards/cards.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { QueuesModule } from './modules/queues/queues.module';
import { HealthModule } from './modules/health/health.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TenantsModule,
    ChatwootModule,
    DashboardScriptModule,
    ContactsModule,
    BoardsModule,
    CardsModule,
    VehiclesModule,
    ContractsModule,
    WebhooksModule,
    QueuesModule,
    HealthModule,
    UploadsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
