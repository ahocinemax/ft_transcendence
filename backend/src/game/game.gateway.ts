import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { WebsocketService } from 'src/websocket/websocket.service';
import { Logger } from '@nestjs/common';
import { AuthenticatedSocket } from 'src/websocket/types/websocket.type';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
	constructor(
		private websocketService: WebsocketService,
		private gameService: GameService
	) {}
	private logger: Logger = new Logger('GameGateway');

	handleDisconnect(client: any) {
		this.websocketService.updateStatus(client, 'online');
		// this.gameService.setGameFinished(client.data.id); // 
	}

	@SubscribeMessage('waitlist request')
	async handleAddingToWaitlist(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() mode: string
	) {
		// s'il est déjà dans une waitlist, on peut décider de l'enlever de la waitlist et le mettre dans une autre
		// a chaque fois qu'il quitte une waitlist et en rejoint une autre, il revient en haut de la pile, donc il devra attendre plus longtemps
		if (this.gameService.isInRoom(client) || this.gameService.isInWaitlist(client, mode)) {
			console.log("user is already in a room or waitlist");
			return;
		}
		await this.gameService.addToWaitlist(client, mode);
		console.log("user ", client.data.name, " added to waitlist", mode);
		console.log("waitlist [", mode, "]: ", this.gameService.getWaitlist(mode).map(player => player.name));
		if (this.gameService.getWaitlist(mode).length >= 2) {
			const roomId: {id: number, name: string} = this.gameService.generateRoomId();
			this.gameService.createRoomAddPlayers(roomId, mode);
			this.gameService.sendRoomIdToUsers(roomId, mode);
			this.gameService.removeUsersFromWaitlist(mode);
		}
	}

	@SubscribeMessage('leave waitlist')
	async handleLeavingWaitlist(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() mode: string
	) {
		console.log("🚀 ~ file: GameGateway ~ remove user from mode:", mode)
		if (this.gameService.isInWaitlist(client, mode)) {
			this.gameService.removeFromWaitlist(client, mode);
			console.log("user  ", client.data.name, " removed from waitlist", mode);
			console.log("waitlist [", mode, "]: ", this.gameService.getWaitlist(mode));
		}
	}

	// @SubscribeMessage('set mode one')
	// @SubscribeMessage('set mode two')
	// @SubscribeMessage('set mode three')
}
