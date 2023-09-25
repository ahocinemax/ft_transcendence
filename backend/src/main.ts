import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as socketIo from 'socket.io';
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.use(cookieParser());

  
  const server = await app.listen(4000);
  const io = new socketIo.Server(server, {
    cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ['content-type'],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true
    }
  });
  io.on('coonnection', (socket) => {
    console.log('New client connected');
  });
  //for test environement = NODE_ENV === development
  if (process.env.NODE_ENV === 'development') {
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    console.log('NODE_ENV:', process.env.NODE_ENV);
  app.setBaseViewsDir('/usr/src/app/views');
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', '..', 'views'));
}
}
bootstrap();
