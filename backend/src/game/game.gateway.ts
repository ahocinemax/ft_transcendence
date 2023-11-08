import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { WebsocketService } from 'src/websocket/websocket.service';
import { Logger } from '@nestjs/common';
import { AuthenticatedSocket } from 'src/websocket/types/websocket.type';
import { ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Room } from './interface/room.interface';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
	constructor(
		private websocketService: WebsocketService,
		private gameService: GameService
	) {}
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('GameGateway');

	handleDisconnect(client: any) {
		this.websocketService.updateStatus(client, 'online');
		const roomId = this.gameService.isInRoom(client);
		if (roomId === false) return ;
		const room: Room = this.gameService.getRoomById(roomId as string, client);
		if (room && this.gameService.leftOngoingGame(client)) return;
			// this.gameService.startGame(room.player1?.data.id,
			// 	room.player2?.data.id, room.ScorePlayer1, room.ScorePlayer2,
			// 	room., room.mode);
	}

	// IL FAUT IMPLEMENTER LE MESSAGE 'START' POUR LANCER LA PARTIE
	@SubscribeMessage('start')
	async handleStartGame(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() roomId: string
	) {
		const room: Room = this.gameService.getRoomById(roomId, client);
		if (room === null) {
			this.logger.log("room not found!");
			return;
		}
		const roomIdNumber = Number(roomId.replace('room_', ''));
		this.gameService.startGame(roomIdNumber, this.server);
	}

	@SubscribeMessage('waitlist request')
	async handleAddingToWaitlist(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() mode: string
	) {
		if (this.gameService.isInRoom(client) !== false || this.gameService.isInWaitlist(client, mode)) {
			console.log("user is already in a room or waitlist");
			return;
		}
		await this.gameService.addToWaitlist(client, mode);
		console.log("user ", client.data.name, " added to waitlist ", mode);
		console.log("updated waitlist [", mode, "]: ", this.gameService.getWaitlist(mode).map(player => player.name));
		if (this.gameService.getWaitlist(mode).length >= 2) {
			const roomId: {id: number, name: string} = this.gameService.generateRoomId();
			await this.gameService.createRoomAddPlayers(roomId, mode);
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
			console.log("user ", client.data.name, " removed from waitlist ", mode);
			console.log("updated waitlist [", mode, "]: ", this.gameService.getWaitlist(mode));
		}
	}

	@SubscribeMessage('room infos request') 
	async handleGetRoomInfos(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() roomId: string
	) {
		console.log("🚀 ~ file: GameGateway ~ handleGetRoomInfos ~ roomId", roomId)
		const room: Room = this.gameService.getRoomById(roomId, client);
		if (room === null) {
			this.logger.log("room not found!");
			return;
		}
		client.emit('room infos response', room);
	}
}
