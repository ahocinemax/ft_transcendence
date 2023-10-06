import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Server, Socket } from 'socket.io';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { WebsocketService } from './websocket/websocket.service';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.use(cookieParser());
  const server = await app.listen(4000);
  //cors for websocket
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:4000', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  io.on('connection', (client: Socket) => {
    io.to(client.id).emit('test');
    console.log('New client connected');
    console.log('client ID: ', client.id);
  });
  const websocketService = app.get(WebsocketService);
  websocketService.setIo(io);
  //console.log(websocketService.io);
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    allowedHeaders: ['content-type'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
}); 
  const websocketGateway = app.get(WebsocketGateway);
  websocketGateway.server = io;
  //for test environement = NODE_ENV === development
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  if (process.env.NODE_ENV === 'development') {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('development mode (back testpage available)');
    app.setBaseViewsDir('/usr/src/app/views');
    app.setViewEngine('ejs');
    app.useStaticAssets(join(__dirname, '..', '..', 'views'));
  }
  else
  {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('production mode (back testpage unavailable)');
  }

}
bootstrap();
