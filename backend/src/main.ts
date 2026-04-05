import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    rawBody: true,
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('port')!;
  const kanbancwDomain = config.get<string>('kanbancwDomain')!;
  const uploadDir = config.get<string>('upload.dir') ?? path.join(process.cwd(), 'uploads');

  // Serve uploaded files as static assets
  app.use('/uploads', express.static(uploadDir));

  app.enableCors({ origin: config.get('cors.origin') ?? '*' });

  app.setGlobalPrefix('api', {
    exclude: ['/health', '/dashboard-script', '/webhooks/:tenant', '/uploads/(.*)'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (config.get('nodeEnv') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('GlobalVeículos API')
      .setDescription('SaaS Automotivo integrado ao Chatwoot')
      .setVersion('0.0.6')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(`Dashboard Script: https://${kanbancwDomain}/dashboard-script`);
}

bootstrap();
