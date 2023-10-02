import { UseFilters,
		ValidationPipe,
		UsePipes }
from '@nestjs/common';

import { 
  ConnectedSocket,
  MessageBody,
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { HttpToWsFilter, ProperWsFilter } from './filter/chat.filter';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { ChannelDTO } from './dto/chat.dto';

@UsePipes(new ValidationPipe())
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())

@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor(private chatService: ChatService, private UserService: UserService) {}
	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
	}

	async newConnection(id: number, @ConnectedSocket() client: Socket) {
		const channels = await this.chatService.getUsersChannels(id);
		await client.join('default_all');
		if (channels)
			for (const channel of channels)
				await client.join(channel);
	}

	@SubscribeMessage('new channel')
	async handleNewChannel(
		@MessageBody() data: ChannelDTO,
		@ConnectedSocket() client: Socket,
	) {
		const channelId = await this.chatService.create_channel(data);
		if (channelId == undefined)
			client.emit(
				'exception',
				'failed to create the channel, please try again',
			);
		else {
			const preview = await this.chatService.get_preview(channelId, data.email, );
			await client.join(preview.name);
			client.emit('add preview', preview);
			this.server.in('update channel request').emit('default_all');
			return data;
		}
	}

	@SubscribeMessage('add preview')
	async handleChatSearch(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		const preview = await this.chatService.get_preview(data.channelId, data.email, );
		await client.join(preview.name);
		client.emit('add preview', preview);
	}
}
