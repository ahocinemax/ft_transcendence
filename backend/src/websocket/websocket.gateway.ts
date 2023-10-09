import { 
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
	ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebsocketService} from './websocket.service';
import { AuthenticatedSocket, ServerEvents } from './types/websocket.type';

@WebSocketGateway({cors: {origin: '*'}})
export class WebsocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{ 
  @WebSocketServer()
  server: Server;

  constructor(private websocketService: WebsocketService) {}
  private logger: Logger = new Logger('WebsocketGateway Log');

	afterInit(server: Server) {
		this.websocketService.server = this.server;
	}

  async handleConnection(@ConnectedSocket() client: any, ...args: any[]) {
    client.data.name = client.handshake.query.name as string;
    this.logger.log(`[NEW CONNEXION] :  ${client.data.name}`);
  }

  async handleDisconnect(client: any) {
    this.logger.log(`[DISCONNECTED] : Client ID ${client.data.name}`);
    this.websocketService.removeUser(client);
		const users = Object.keys(this.websocketService.clients);
		this.websocketService.sendMessage(client, 'user_disconnected', users);
		await this.websocketService.updateStatus(client, 'offline');
  }

  @SubscribeMessage('handshake')
	async handleHandshake(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: string
	) {
		console.info(`Handshake received from [${client.data.name}]`);

		const reconnected = this.websocketService.getClient(client.data.name);

		if (reconnected) {
			console.info(`User [${client.data.name}] has reconnected`);
			return;
		}

		this.websocketService.addUser(client);
		const users = Object.keys(this.websocketService.clients);

		console.info('Sending callback for handshake...');
		this.server.to(client.id).emit('handshake', client.data.name, users);
		this.websocketService.sendMessage(client, 'user_connected', users);
		await this.websocketService.updateStatus(client, 'online');
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