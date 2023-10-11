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

@WebSocketGateway({cors: {origin: '*'}})
export class WebsocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{ 
  @WebSocketServer()
  server: Server;

  userStatusMap = new Map<number, Status>();
  clientSocket = new Map<number, Socket>();


  onlineFromService(id: number) {
    this.userStatusMap.set(id, Status.online);
    const serializedMap = [...this.userStatusMap.entries()];
    this.server.emit('update-status', serializedMap);
  }

  offlineFromService(id: number) {
    this.userStatusMap.set(id, Status.offline);
    const serializedMap = [...this.userStatusMap.entries()];
    this.server.emit('update-status', serializedMap); 
  }

  inGameFromService(id: number) {
    this.userStatusMap.set(id, Status.inGame);
    const serializedMap = [...this.userStatusMap.entries()];
    this.server.emit('update-status', serializedMap);
  }

  constructor(private websocketService: WebsocketService) {}
  private logger: Logger = new Logger('WebsocketGateway Log');

	afterInit(server: Server) {
		this.websocketService.server = this.server;
	}

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket, ...args: any[]) {
    console.log("Client connected: ", client);
    client.data.name = client.handshake.query.name as string;
    this.logger.log(`[NEW CONNEXION] :  ${client.data.name}`);
    this.websocketService.addUser(client);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`[DISCONNECTED] : Client ID ${client.data.name}`);
    this.websocketService.removeUser(client);
		const users = Object.keys(this.websocketService.clients);
		this.websocketService.sendMessage(client, 'user_disconnected', users);
    client.removeAllListeners();
		await this.websocketService.updateStatus(client, 'offline');
  }

  @SubscribeMessage('handshake')
	async handleHandshake(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: string
	) {
		this.logger.log(`Handshake received from [${client.data.name}]`);

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