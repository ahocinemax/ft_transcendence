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
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebsocketService} from './websocket.service';
import { AuthenticatedSocket, ServerEvents } from './types/websocket.type';

export enum Status {
	offline,
	online,
	inGame,
}

/**
* @description Entrypoint of all fetch requests from the front. Use it to fetch data from the database 
* @remarks This class implements oneGatewayInit, OnGatewayConnection, OnGatewayDisconnect to update the status of the users
* @param id uuid generated using the uuid library
* @param createdAt creation date as a Date object
* @param server The WebSocketServer. It is used to dispatch lobby state to clients
* @protected
*/

@WebSocketGateway() 
export class WebsocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(forwardRef(() => WebsocketService))
    private websocketService: WebsocketService) {}

  private logger: Logger = new Logger('WebsocketGateway Log');

  userStatusMap = new Map<string, Status>();
  clientSocket = new Map<string, Socket>();

	afterInit(server: Server) {
		this.websocketService.server = this.server;
	}

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket, ...args: any[]) {
    client.data.name = client.handshake.query.name as string;
    client.join('default_all');
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`[DISCONNECTED] :  Client ID ${client.data.name}`);
    this.websocketService.removeUser(client);
		const users = Object.keys(this.websocketService.clients);
		this.websocketService.sendMessage(client, 'user_disconnected', users);
    client.removeAllListeners();
		await this.websocketService.updateStatus(client, 'offline');
  }

  @SubscribeMessage('handshake')
	async handleHandshake(
		@ConnectedSocket() client: AuthenticatedSocket,
	) {
		this.logger.log(`Handshake received from [${client.data.name}]`);

		const reconnected = this.websocketService.getClient(client.data.name);

		if (reconnected) {
      this.logger.log(`User [${client.data.name}] has reconnected`);
      return ;
    }
    
    this.websocketService.addUser(client);
		const users = Array.from(this.websocketService.clients.keys());
		this.logger.log(`🚀 ~ Connected clients: ${users}`);
		client?.emit('handshake', client.data.name, users); // not working
		this.websocketService.sendMessage(client, 'user_connected', users);
		await this.websocketService.updateStatus(client, 'online');
	}
}
