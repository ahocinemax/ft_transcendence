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

@WebSocketGateway({cors: {origin: '*',},})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{ 
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway Log');
  

  afterInit(server: Server) {    
    this.logger.log('Initialized!');
    this.logger.log('server: ', server);    
  }
  
  handleConnection(
    @ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    //client.emit('test from backend');
    this.server.to(client.id).emit('test from backend');
    console.log('(((((socket))))): ', client);
  }
  
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    // @MessageBody() message: string,
    // @ConnectedSocket() client: Socket) {
    client: Socket, payload: any) {
    this.logger.log(`message received`);
    //console.log('message: ', message);
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