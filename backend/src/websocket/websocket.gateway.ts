import { 
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{ 
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway Log');
  constructor(private websocketService: WebsocketService) {
    console.log('WebsocketService in Gateway:', this.websocketService.io);
  }


  afterInit(server: Server) {    
    this.server = this.websocketService.io;
    console.log('WebsocketGateWay server: ', this.server);
    this.logger.log('Initialized!');
    this.logger.log(this.server);    
  }
  
  handleConnection(
    @ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    //client.emit('test from backend');
    this.server.to(client.id).emit('message');
    console.log('(((((socket))))): ', client);
  }
  
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
     @MessageBody() data: string,
     @ConnectedSocket() client: Socket) {
    //client: Socket, payload: any) {
    this.logger.log(`message received: ${data}`);
    console.log('payload: ', data);
    console.log(client);
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