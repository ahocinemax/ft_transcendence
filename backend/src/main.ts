import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Server, Socket } from 'socket.io';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { WebsocketService } from './websocket/websocket.service';

import { PrismaService } from 'prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  const config = new DocumentBuilder()
      .setTitle('TranscendenceAPI')
      .setDescription('Transcendence game data provider')
      .setVersion('1.0')
      .addTag('Transcendence')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors({ origin: process.env.FRONT_URL});
  app.get(PrismaService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, }));

  const reflector = new Reflector();

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
