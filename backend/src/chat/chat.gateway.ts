import { UseFilters,
	ValidationPipe,
	UsePipes,
	Logger }
from '@nestjs/common';

import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage, 
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { HttpToWsFilter, ProperWsFilter } from './filter/chat.filter';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { ChannelDTO, MessageDTO } from './dto/chat.dto';
import { AuthenticatedSocket } from 'src/websocket/types/websocket.type';

@UsePipes(new ValidationPipe()) 
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer() 
	server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private chatService: ChatService, private UserService: UserService) {}

	async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
		const user = await this.UserService.getUserByName(client.data.name as string);
		this.logger.log('[NEW CONNECTION]: ' + user.name);

		const email = user?.email;
		const channels = await this.chatService.get_channels();
		const MPs = await this.chatService.getUsersMPs(email);
		if (channels) for (const channel of channels)
			await client?.join(channel.name);
		if (MPs) for (const MP of MPs)
			await client?.join(MP.name);
	}

	@SubscribeMessage('new channel')
	async handleNewChannel(
		@MessageBody() data: ChannelDTO,
		@ConnectedSocket() client: Socket,
	) {
		this.logger.log("[NEW CHANNEL]");

		const channelId = await this.chatService.create_channel(data);
		if (channelId == undefined)
			client.emit('exception', 'failed to create the channel, please try again');
		else {
			await client.join(data.name);
			// demande à tous les clients connectés de mettre à jour la liste des channels
			this.server.to('default_all').emit('update channel request');
		}
	}

	@SubscribeMessage('new message')
	async handleNewMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
		this.logger.log("[NEW  MESSAGE]");
		const channelId = data.channelId;
		const channel = await this.chatService.get_channel_by_id(channelId);
		const to_send = await this.chatService.new_message(data) === undefined
		if (to_send === undefined)
			client.emit('exception', 'failed to create the message, please try again');
		else {
			this.server.to(channel.name).emit('update message request');
		}
	}

	@SubscribeMessage('new mp')
	async handleNewPrivateMessage(
			@MessageBody() data: any,
			@ConnectedSocket() client: Socket) {
		this.logger.log("[NEW PRIVATE MESSAGE SESSION]");
		const to_send = await this.chatService.create_mp(data[0], data[1]);
		if (to_send === undefined)
			client.emit('exception', 'failed to create the message, please try again');
		else {
			const all_msg = await this.chatService.fetch_messages(to_send);
			client.emit('fetch mp', all_msg);
		}
	}

	@SubscribeMessage('get messages')
	async handleGetMessages(@MessageBody() channelId: number, @ConnectedSocket() client: Socket) {
		const data = await this.chatService.fetch_messages(channelId); 
		client.emit('fetch messages', data);
	}

	@SubscribeMessage('get channels')
	async handleFetchChannels(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET CHANNELS]");
		const data = await this.chatService.get_channels();
		client.emit('fetch channels', data);
	}

	@SubscribeMessage('get mp')
	async handleFetchMP(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET MP]");
		const data = await this.chatService.getUsersMPs(email);
		client.emit('fetch mp', data);
	}

	// @SubscribeMessage('users in')
	// async getUsersIn(channelId: number) {
	// 	const data = await this.chatService.getRegisteredUsers(channelId);
	// 	return data;
	// }
}
