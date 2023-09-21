import { 
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway({cors: {origin: '*'}})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway Log');

  @SubscribeMessage('chatToServer')
  handleMessage(@MessageBody() message: string) {
    this.logger.log('message received');
    this.server.emit('update', message);
  }
}

/*
  memo:
  client -> front
  server -> back
  frontからbackにメッセージを送ることができるようにする
  そのためには、back側で、frontからのメッセージを受け取るための
  メソッドを用意する必要がある
*/