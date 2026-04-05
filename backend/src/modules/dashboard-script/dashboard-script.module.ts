import { Module } from '@nestjs/common';
import { DashboardScriptController } from './dashboard-script.controller';

@Module({
  controllers: [DashboardScriptController],
})
export class DashboardScriptModule {}
