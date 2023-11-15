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
		client.data.user = user;
		this.logger.log(`[NEW CONNECTION]: ${client.data.name}`);

		const email = user?.email;
		const channels = await this.chatService.get_channels();
		const MPs = await this.chatService.getUsersMPs(email);
		if (channels) for (const channel of channels) {
			await client?.join(channel.name);
			// console.log('client ', client.data.name, ' joined channel ', channel.name);
		}
		if (MPs) for (const MP of MPs) {
			// console.log('client ', client.data.name, ' joined MP ', MP.name);
			await client?.join(MP.name);
		}
	}

	async handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
		this.logger.log(`[DISCONNECTED] ${client.data.name}`);
		client.removeAllListeners();
	}

	@SubscribeMessage('get roles')
	async handleGetRoles(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET ROLES]");
		const userId = client.data?.user?.id;
		const channelId = data[0];
		const roles = await this.chatService.getRoles(channelId, userId);
		client.emit('fetch roles', roles);
	}

	@SubscribeMessage('check password')
	async handleCheckPassword(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		this.logger.log("[CHECK PASSWORD]");
		const channelID = data[0];
		const password = data[1];
		const isPasswordCorrect = await this.chatService.checkPassword(channelID, password);
		client.emit('password check result', isPasswordCorrect);
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
			await this.chatService.add_channel_member(channelId, client.data?.user?.id);
			// demande à tous les clients connectés de mettre à jour la liste des channels
		}
		client.emit('new channel id', channelId);
		this.server.to('default_all').emit('update channel request');
	}

	@SubscribeMessage('get channels') //ban / kick
	async handleFetchChannels(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		const userId = client.data?.user?.id;
		this.logger.log("[GET CHANNELS]");
		const data = await this.chatService.get_channels2(userId);
		client.emit('fetch channels', data);
	}

	@SubscribeMessage('register to channel')
	async handleRegisterToChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		this.logger.log("[REGISTER TO CHANNEL]");
		const channelId = data;
		const userId = client.data.user.id;
		const channel = await this.chatService.get_channel_by_id(channelId);
		await this.chatService.add_channel_member(channelId, userId);
		await client.join(channel.name);
	}

	@SubscribeMessage('leave channel')
	async handleLeaveChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		this.logger.log("[LEAVE CHANNEL]");
		const channelId = data;
		const userId = client.data.user.id;
		await this.chatService.remove_channel_member(channelId, userId);
	}

	@SubscribeMessage('new message') 
	async handleNewMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
		this.logger.log("[NEW  MESSAGE]");
		const channelId = data.channelId;
		const channel = await this.chatService.get_channel_by_id(channelId); // ajouter une nouvelle etape prisma (add menmber)
		const isMessageCreated = await this.chatService.new_message(data) === undefined
		if (isMessageCreated === undefined)
			client.emit('exception', 'failed to create the message, please try again');
		else
			this.server.to(channel.name).emit('update message request');
	}

	@SubscribeMessage('get messages') // mute
	async handleGetMessages(@MessageBody() channelId: number, @ConnectedSocket() client: Socket) {
		const userId = client.data.user.id;
		const isMember = await this.chatService.is_member(channelId, userId);
		// if (!isMember) return; A ACTIVER QUAND ON POURRA S'INSCRIRE EN TANT QUE MEMBRE
		const data = await this.chatService.messages_from_channel_id(channelId); 
		client.emit('fetch messages', data);
	}

	@SubscribeMessage('new mp') // mp is a private channel between two users
	async handleNewPrivateMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const creator: string = data[0];
		const otherClient = data[1];
		this.logger.log(`[NEW PRIVATE MESSAGE CHANNEL]: ${creator}, ${otherClient.name}`);
		const to_send = await this.chatService.create_mp(creator, otherClient);
		if (to_send === null)
			this.logger.log('MP already exists');
		else {
			// The two users are joining to the room
			client.join(otherClient.name);
			this.websocketGateway.clientSocket.get(otherClient.name)?.join(otherClient.name);
			// both of the users are notified that the channel has been created
			this.server.to(otherClient.name).emit('update private request');
		}
	}

	@SubscribeMessage('get mp')
	async handleFetchMP(@MessageBody() email: string, @ConnectedSocket() client: Socket) {
		this.logger.log("[GET MP]");
		const data = await this.chatService.getUsersMPs(email);
		for (const mp of data) {
			let ownersNames: string[] = [];
			let tempOwners: string[] = await this.chatService.getChannelOwners(mp.id);
			ownersNames.push(tempOwners[0]);
			ownersNames.push(tempOwners[1]);
			mp['owners'] = ownersNames;
			if (mp.name === client.data.name)
			mp.name = ownersNames[0] === client.data.name ? ownersNames[1] : ownersNames[0];
		}
		client.emit('fetch mp', data);
	}
}
