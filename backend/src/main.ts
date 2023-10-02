import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { PrismaService } from 'prisma/prisma.service';
import { JwtGuard } from './auth/guard/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalGuards(new JwtGuard(reflector));

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
