import { UseFilters } from '@nestjs/common';
import { 
  ConnectedSocket,
  MessageBody,
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { ChannelDTO } from './dto/chat.dto';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService, private UserService: UserService) {}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
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
			// this.updateChannelRequest('update channel request', 'default_all');
			return data;
		}
	}
}
