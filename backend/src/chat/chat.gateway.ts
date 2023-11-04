import { UseFilters,
	ValidationPipe,
	UsePipes,
	Logger }
from '@nestjs/common';

import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage, 
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { HttpToWsFilter, ProperWsFilter } from './filter/chat.filter';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { ChannelDTO } from './dto/chat.dto';
import { AuthenticatedSocket } from 'src/websocket/types/websocket.type';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@UsePipes(new ValidationPipe()) 
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(
		private chatService: ChatService,
		private UserService: UserService,
		private websocketGateway: WebsocketGateway) {}

	async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
		const user = await this.UserService.getUserByName(client.data.name as string);
		this.logger.log(`[NEW CONNECTION]:  ${user.name}`);

		const email = user?.email;
		const channels = await this.chatService.get_channels();
		const MPs = await this.chatService.getUsersMPs(email);
		if (channels) for (const channel of channels) {
			await client?.join(channel.name);
			console.log('client ', client.data.name, ' joined channel ', channel.name);
		}
		if (MPs) for (const MP of MPs) {
			console.log('client ', client.data.name, ' joined MP ', MP.name);
			await client?.join(MP.name);
		}
	}

	async handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
		this.logger.log(`[DISCONNECTED] ${client.data.name}`);
		client.removeAllListeners();
	}

	@SubscribeMessage('new channel')
	async handleNewChannel(
		@MessageBody() data: ChannelDTO,
		@ConnectedSocket() client: Socket,
	) {
		this.logger.log("[NEW CHANNEL]");

		const channelId: number = await this.chatService.create_channel(data);
		if (channelId == undefined)
			client.emit('exception', 'failed to create the channel, please try again');
		else {
			await client.join(data.name);
			// demande à tous les clients connectés de mettre à jour la liste des channels
		}
		client.emit('new channel id', channelId);
		this.server.to('default_all').emit('update channel request');
	}

	@SubscribeMessage('get channels')
	async handleFetchChannels(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET CHANNELS]");
		const data = await this.chatService.get_channels();
		client.emit('fetch channels', data);
	}

	@SubscribeMessage('new message')
	async handleNewMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
		this.logger.log("[NEW  MESSAGE]");
		const channelId = data.channelId;
		const channel = await this.chatService.get_channel_by_id(channelId);
		const isMessageCreated = await this.chatService.new_message(data) === undefined
		if (isMessageCreated === undefined)
			client.emit('exception', 'failed to create the message, please try again');
		else {
			this.server.to(channel.name).emit('update message request');
		}
	}

	@SubscribeMessage('get messages')
	async handleGetMessages(@MessageBody() channelId: number, @ConnectedSocket() client: Socket) {
		const data = await this.chatService.messages_from_channel_id(channelId); 
		client.emit('fetch messages', data);
	}

	@SubscribeMessage('new mp') // mp is a private channel between two users
	async handleNewPrivateMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const creator: string = data[0];
		const otherClient = data[1];
		this.logger.log(`[NEW PRIVATE MESSAGE CHANNEL]: ${creator}, ${otherClient.name}`);
		const to_send = await this.chatService.create_mp(creator, otherClient);
		if (to_send === undefined)
			client.emit('exception', 'failed to create the mp, please try again');
		else {
			// The two users are joining to the room
			client.join(otherClient.name);
			this.websocketGateway.clientSocket.get(otherClient.name)?.join(otherClient.name);
			console.log("🚀 ~ handleNewPrivateMessage ~ otherClient:", this.websocketGateway.clientSocket);
			// both of the users are notified that the channel has been created
			this.server.to(otherClient.name).emit('update private request');
		}
	}

	@SubscribeMessage('get mp')
	async handleFetchMP(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET MP]");
		const data = await this.chatService.getUsersMPs(email);
		client.emit('fetch mp', data);
	}
}
