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

@UsePipes(new ValidationPipe()) 
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer() 
	server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private chatService: ChatService, private UserService: UserService) {}

	async handleConnection(@ConnectedSocket() client: Socket) { // client is undefined
		const user = await this.UserService.getUserByName(client.data.name as string);
		this.logger.log('[NEW CONNECTION]: ' + user.name);

		const email = user?.email;
		const channels = await this.chatService.getUsersChannels(email);
		await client?.join('default_all');
		if (channels)
			for (const channel of channels)
				await client?.join(channel);
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
			const preview = await this.chatService.get_preview(channelId, data.email);
			await client.join(preview.name);
			// envoie une list mise à jour des nouveaux channels
			client.emit('fetch channels', this.chatService.get_channels());
			// demande à tous les clients connectés de mettre à jour la liste des channels
			this.server.to('default_all').emit('update channel request');
		}
	}

	@SubscribeMessage('new message')
	async handleNewMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
		this.logger.log("[NEW  MESSAGE]");
		const to_send = await this.chatService.new_message(data) === undefined
		if (to_send === undefined)
			client.emit('exception', 'failed to create the message, please try again');
		else {
			const all_msg = await this.chatService.fetch_messages(data.channelId);
			console.log("🚀 ~ file: chat.gateway.ts:78 ~ ChatGateway ~ handleNewMessage ~ all_msg:", all_msg)
			client.emit('fetch messages', all_msg);
		}
	}

	@SubscribeMessage('add preview') // display channels list available for the user
	async handleChatSearch(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const preview = await this.chatService.get_preview(data.channelId, data.email, );
		await client.join(preview.name);
		client.emit('add preview', preview);
	}

	@SubscribeMessage('get messages')
	async handleGetMessages(@MessageBody() channelId: number, @ConnectedSocket() client: Socket) {
		const data = await this.chatService.fetch_messages(channelId); 
		// console.log("🚀 ~  What I will send to the front ~ data:", data);
		client.emit('fetch messages', data);
	}

	@SubscribeMessage('get channels')
	async handleFetchChannels(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET CHANNELS]");
		const data = await this.chatService.getUsersChannels(email);
		client.emit('fetch channels', data);
	}

	@SubscribeMessage('users in')
	async getUsersIn(channelId: number) {
		const data = await this.chatService.getRegisteredUsers(channelId);
		return data;
	}
}
