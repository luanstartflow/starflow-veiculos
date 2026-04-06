"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const configuration_1 = require("./config/configuration");
const prisma_service_1 = require("./database/prisma.service");
const auth_module_1 = require("./modules/auth/auth.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const chatwoot_module_1 = require("./modules/chatwoot/chatwoot.module");
const dashboard_script_module_1 = require("./modules/dashboard-script/dashboard-script.module");
const contacts_module_1 = require("./modules/contacts/contacts.module");
const boards_module_1 = require("./modules/boards/boards.module");
const cards_module_1 = require("./modules/cards/cards.module");
const vehicles_module_1 = require("./modules/vehicles/vehicles.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const webhooks_module_1 = require("./modules/webhooks/webhooks.module");
const queues_module_1 = require("./modules/queues/queues.module");
const health_module_1 = require("./modules/health/health.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    connection: {
                        host: config.get('redis.host'),
                        port: config.get('redis.port'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            chatwoot_module_1.ChatwootModule,
            dashboard_script_module_1.DashboardScriptModule,
            contacts_module_1.ContactsModule,
            boards_module_1.BoardsModule,
            cards_module_1.CardsModule,
            vehicles_module_1.VehiclesModule,
            contracts_module_1.ContractsModule,
            webhooks_module_1.WebhooksModule,
            queues_module_1.QueuesModule,
            health_module_1.HealthModule,
            uploads_module_1.UploadsModule,
        ],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map