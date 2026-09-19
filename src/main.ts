import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { 
      allowedHeaders: '*', 
      origin: '*', 
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
    },
    logger: ['error', 'warn', 'log'],
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe(
      { 
        whitelist: true, 
        transform: true 
      }
    ));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Aide flow Backend').setDescription('NestJS + Prisma backend for Aide, a self-hosted voice assistant — persists reminders and todos, and powers an on-device LLM agent that reads your schedule, sets reminders, and manages tasks')
    .setVersion('1.0').addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt-auth').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);
  writeFileSync(join(process.cwd(), 'swagger-spec.json'), JSON.stringify(document, null, 2));
  await app.listen(4006);
  
  console.log('AideFlow service: http://localhost:4000/api/v1');
  console.log(
    `Swagger is running on: ${await app.getUrl()}/api/v1`,
  );
}
bootstrap();
