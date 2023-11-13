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
		this.gameService.removeFromWaitlist(client, 'normal');
		this.gameService.removeFromWaitlist(client, 'hard');
		this.gameService.removeFromWaitlist(client, 'hardcore');
		const roomId = this.gameService.isInRoom(client);
		if (roomId === false) return ;
		const room: Room = this.gameService.getRoomById(roomId as string);
		if (room) this.gameService.leftOngoingGame(client);
	}

	@SubscribeMessage('start')
	async handleStartGame(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() roomId: string
	) {
		const room: Room = this.gameService.getRoomById(roomId, false);
		if (room === null) return;
		if (room.player1?.data.id === client.data.id)
			room.player1 = client;
		else if (room.player2?.data.id === client.data.id)
			room.player2 = client;
		else return;
		Object.assign(room, room);
		const roomIdNumber = Number(roomId.replace('room_', ''));
		this.gameService.startGame(roomIdNumber, this.server);
	}

	@SubscribeMessage('update direction')
	async handleUpdateDirection(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
		const roomId = data[0];
		const dir = data[1];
		const room: Room = this.gameService.getRoomById(roomId);
		if (room === null) return;
		let direction = 'none';
		if (dir === 1) direction = 'down'
		else if (dir === 2) direction = 'up';
		this.gameService.updateDirection(roomId, client, direction);
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
		if (this.gameService.isInWaitlist(client, mode)) {
			this.gameService.removeFromWaitlist(client, mode);
		}
	}

	@SubscribeMessage('room infos request') 
	async handleGetRoomInfos(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() roomId: string
	) {
		const room: Room = this.gameService.getRoomById(roomId);
		if (room === null) {
			this.logger.log("room not found!");
			return;
		}
		client.emit('room infos response', room);
	}

	@SubscribeMessage('duel request')
	async handleDuelRequest(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: any
	) {
		const opponentID: number = data[0];
		const opponentName: string = data[1];
		const mode: string = data[2];
		const opponent = this.websocketService.getConnectedUserByName(opponentName);
		if (opponent === null) {
			console.log("opponent not found!");
			return;
		}
		if (this.gameService.isInRoom(client) || this.gameService.isInRoom(opponent)) {
			console.log("user or opponent is already in a room");
			return;
		}
		const roomId: {id: number, name: string} = this.gameService.generateRoomId();
		await this.gameService.createCustomRoomAddPlayers(roomId, mode, client, opponent);
		this.gameService.sendRoomIdToUsers(roomId, mode);
	}
}
