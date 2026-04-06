"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const express = require("express");
const path = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
        rawBody: true,
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('port');
    const kanbancwDomain = config.get('kanbancwDomain');
    const uploadDir = config.get('upload.dir') ?? path.join(process.cwd(), 'uploads');
    app.use('/uploads', express.static(uploadDir));
    app.enableCors({ origin: config.get('cors.origin') ?? '*' });
    app.setGlobalPrefix('api', {
        exclude: ['/health', '/dashboard-script', '/webhooks/:tenant', '/uploads/(.*)'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    if (config.get('nodeEnv') !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('GlobalVeículos API')
            .setDescription('SaaS Automotivo integrado ao Chatwoot')
            .setVersion('0.0.6')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    await app.listen(port);
    logger.log(`Application running on port ${port}`);
    logger.log(`Dashboard Script: https://${kanbancwDomain}/dashboard-script`);
}
bootstrap();
//# sourceMappingURL=main.js.map