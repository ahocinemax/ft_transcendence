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
import { ChannelDTO } from './dto/chat.dto';

@UsePipes(new ValidationPipe())
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer() 
	server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private chatService: ChatService, private UserService: UserService) {}

	async handleConnection(id: number, @ConnectedSocket() client: Socket) {
		console.log('new connection');
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
			console.log(data);
			this.logger.log(data);
			return data;
		}
	}

	@SubscribeMessage('add preview') // display channels list available for the user
	async handleChatSearch(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		const preview = await this.chatService.get_preview(data.channelId, data.email, );
		await client.join(preview.name);
		client.emit('add preview', preview);
	}
}
