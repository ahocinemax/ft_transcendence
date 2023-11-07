import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { ConnectedSocket, WsException } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticatedSocket, ServerChatEvents } from './types/websocket.type';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketService {
    constructor(
        private readonly prisma: PrismaService,
		@Inject(forwardRef(() => WebsocketGateway))
		private websocketGateway: WebsocketGateway) {}

    public server: Server;
    public clients = this.websocketGateway.clientSocket;
	private logger: Logger = new Logger('Websocket Service');

    public removeUser(@ConnectedSocket() client: AuthenticatedSocket) {
		return this.websocketGateway.clientSocket.delete(client.data.name);
	}

    public getClient(username: string): AuthenticatedSocket | undefined {
		return this.websocketGateway.clientSocket.get(username);
	}

    public async emitUserList(
		client: AuthenticatedSocket,
		userList: User[],
		lobbyId: string
	) {
		if (!client) return;
		// const blacklist = await this.blockedService.getBlockList(client.data.name);
		console.log(`emmiting to ${client.data.name}`);
		this.server.to(client.id).emit(ServerChatEvents.UserList, {
			lobbyId,
			users: userList //.filter((user: any) => !blanned.includes(user.name)),
		});
	}

	public async emitUserListToLobby(userList: User[], lobbyId: string) {
		this.websocketGateway.clientSocket.forEach((client: AuthenticatedSocket) => {
			this.emitUserList(client, userList, lobbyId); 
		})
	}

	public addUser(@ConnectedSocket() client: AuthenticatedSocket) {
		this.websocketGateway.clientSocket.set(client.data.name, client);
	}

	public updateClient(username: string) {
		const client = this.getClient(username);
		if (!client) return ;
		// remove old client
		this.websocketGateway.clientSocket.delete(username);
		// update name
		client.data.name = username;
		// add updated client
		this.addUser(client);
	}

	public async updateStatus(
		@ConnectedSocket() client: AuthenticatedSocket,
		type: string
		) {
			switch (type) {
				case 'online': await this.setOnline(client);
				break;
			case 'busy': await this.setBusy(client);
				break;
			case 'offline': await this.setOffline(client);
				break;
			default:
				break;
			}
		console.log(`${client?.data.name} is now ${type}`);
	}

    private async setOnline(@ConnectedSocket() client: AuthenticatedSocket) {
		try {
			await this.prisma.user.update({
				where: {name: client.data.name},
				data: {status: 'online'}
			});
			this.sendMessage(client, 'update_status', {
				status: 'online',
				user: client.data.name,
			});
		} catch (error) { console.log('Failed to update status of user to online'); }
	} 

	private async setBusy(@ConnectedSocket() client: AuthenticatedSocket) {
		try {
			await this.prisma.user.update({
				where: {name: client.data.name},
				data: {status: 'ingame'}
			});
			this.sendMessage(client, 'update_status', {
				status: 'ingame',
				user: client.data.name,
			});
		} catch (error) {
			console.log('Failed to update status of user');
		}
	}

	private async setOffline(@ConnectedSocket() client: AuthenticatedSocket) {
		setTimeout(async () => {
			if (!this.getClient(client.data.name)) {
				try {
					await this.prisma.user.update({
						where: {name: client.data.name},
						data: {status: 'offline'}
					});
					this.sendMessage(client, 'update_status', {
						status: 'offline',
						user: client.data.name,
					});
				} catch (error) { console.log('Failed to update status of user'); }
			}
		}, 5_000);
	}

    public sendMessage(
		@ConnectedSocket() client: AuthenticatedSocket,
		event: string,
		payload?: Object
	) {
		this.logger.log(`Emitting event [${event}] to connected clients`);
		payload ? client.broadcast.emit(event, payload) : client.broadcast.emit(event);
	}
}