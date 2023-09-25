import { 
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{ 
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway Log');
  
  afterInit(server: Server) {
    this.logger.log('Initialized!');
    this.logger.log('server: ', server);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(@MessageBody() message: string) {
    this.logger.log('message received');
    this.server.emit('chatToServer', message);
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