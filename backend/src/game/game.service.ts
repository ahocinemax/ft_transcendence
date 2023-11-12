import { 
	forwardRef,
	Inject,
	Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { Mutex } from 'async-mutex';
import { Room } from './interface/room.interface';
import { waitingPlayer } from './interface/player.interface';
import { GameData } from './interface/game-data.interface';
import { AuthenticatedSocket } from 'src/websocket/types/websocket.type';
import { SchedulerRegistry } from '@nestjs/schedule';

const paddleSpeed = 3;
const refreshRate = 10;

type Waitlist = waitingPlayer[];

type Waitlists = {
	normal: Waitlist;
	hard: Waitlist;
	hardcore: Waitlist;
};
@Injectable()
export class GameService {
	ballSpeed = 0.25;

	constructor(
	private readonly prisma: PrismaService,
	@Inject(forwardRef(() => UserService))
	private readonly userService: UserService,
	private schedulerRegistry: SchedulerRegistry
	) {}

	static rooms: Room[] = [];
	static waitlists: Waitlists = {
		normal: [],
		hard: [],
		hardcore: [],
	};

	async startGame(roomID: number, server: Server){
		const room: Room = GameService.rooms.find((room) => room.id === roomID);
		const gameData: GameData = {
			paddleLeft: 0,
			paddleRight: 0,
			xBall: 0,
			yBall: 0,
			player1Score: 0,
			player2Score: 0,
			player1Name: room.NamePlayer1,
			player2Name: room.NamePlayer2,
			player1Avatar: room.AvatarPlayer1,
			player2Avatar: room.AvatarPlayer2,
			startTime: new Date(),
			gameID: roomID,
		};
		const mutex = new Mutex();

		const intervals = this.schedulerRegistry.getIntervals();
		if (intervals.indexOf('room_' + roomID) === -1)
		{
			this.initBall(roomID);
			const interval = setInterval(() => { this.gameLoop(roomID, server, gameData, mutex); }, refreshRate);
			this.schedulerRegistry.addInterval('room_' + roomID, interval);
		}
	}

	async gameLoop(roomID: number, server: Server, gameData: GameData, mutex: Mutex) {
		const release = await mutex.acquire();
		let room: Room = this.getRoomById('room_' + roomID, false);
		if (!room) {
			release();
			return;
		}
		if (room.player1Disconnected || room.player2Disconnected){
			server.to(room.name).emit('game over', room.player2Disconnected ? 1 : 2, this.getRoomById(room.name));
		} else {
			this.updatePaddles(roomID);
			this.updateBall(roomID);
			gameData.paddleLeft = room.paddleLeft;
			gameData.paddleRight = room.paddleRight;

			gameData.xBall = room.xball;
			gameData.yBall = room.yball;

			gameData.player1Score = room.ScorePlayer1;
			gameData.player2Score = room.ScorePlayer2;
			server.to(room.name).emit('game data', gameData);
		}
		let winner: number = 0;
		if (room.player1Disconnected || room.player2Disconnected) {
			winner = room.player2Disconnected ? 1 : 2;
			console.log("a player disconnected, winner is ", winner);
		}
		if (room.ScorePlayer1 === 2 || room.ScorePlayer2 === 2 || winner) {
			if (!winner) {
				winner = room.ScorePlayer1 > room.ScorePlayer2 ? 1: 2;
				console.log("game over, winner is ", winner);
			}
			server.to(room.name).emit('game over', winner, this.getRoomById(room.name));
			this.schedulerRegistry.deleteInterval('room_' + roomID);
			const endTime = new Date();
			this.saveGame(
				room.id,
				endTime,
				gameData.startTime,
				winner
			);
			GameService.rooms.splice(GameService.rooms.findIndex((room) => room.id === roomID), 1);
		}
		release();
	}

	/**
	* Call this method when the game is over to save infos in the database
	*/
	async saveGame(
		roomId: number,
		startTime: Date,
		endTime: Date,
		winner: number
	) {
		const room: any = GameService.rooms.find((room) => room.id === roomId);
		if (!room) return;
		const IdPlayer1: number = room.player1.data.user.id;
		const IdPlayer2: number = room.player2.data.user.id;
		const ScorePlayer1: number = room.ScorePlayer1;
		const ScorePlayer2: number = room.ScorePlayer2;
		const mode: string = room.mode;
		const game = await this.prisma.game.create({
			data: {
				player1: IdPlayer1,
				ScorePlayer1: ScorePlayer1,
				player2: IdPlayer2,
				ScorePlayer2: ScorePlayer2,
				startTime: startTime,
				endTime: endTime,
				mode: mode,
				winner: winner,
			},
		});
		const id = game.id;
		const duration = Math.abs(game.endTime.getTime() - game.startTime.getTime());
		await this.prisma.game.update({
			where: { id: id },
			data: { duration: duration },
		});
		await this.userService.updateUserStats(
			IdPlayer1,
			winner === 1 ? 1 : 0, // GamesWon += 1
			winner === 2 ? 1 : 0, // GamesLost += 1
			ScorePlayer1,
			id
		);
		await this.userService.updateUserStats(
			IdPlayer2,
			winner === 2 ? 1 : 0,
			winner === 1 ? 1 : 0,
			ScorePlayer2,
			id
		);
		this.updateRanks();
		return game;
	}

	initBall(roomId: number) {
		// recherche une room dans la liste en utilisant roomId.
		const room: Room = GameService.rooms.find(room => room.id === roomId);
		if (!room) return; // Vérifiez si la salle a été trouvée

		// Copie la room pour éviter de modifier directement l'objet d'origine.
		const updatedRoom = { ...room };
		
		// Set la balle au centre du canvas
		updatedRoom.xball = 50;
		updatedRoom.yball = 50;

		// Détermine la vitesse de la balle en fonction du mode (normal, hard, hardcore)
		updatedRoom.ballSpeed = room.mode === 'normal' ? 0.3 : room.mode === 'hard' ? 0.7 : 1 ;
		updatedRoom.xSpeed = updatedRoom.ballSpeed;
		updatedRoom.ySpeed = 0.15 + Math.random() * updatedRoom.ballSpeed;

		// Détermine aléatoirement la direction de la balle pour les composantes x et y
		let direction = Math.round(Math.random());
		if (direction) updatedRoom.xSpeed *= -1;
		direction = Math.round(Math.random());
		if (direction) updatedRoom.ySpeed *= -1;

		// Copie les propriétés mises à jour vers la room d'origine
		Object.assign(room, updatedRoom);
	}

	/**
	 * update ball coordinate
	 */
	updateBall(roomId: number) {
		const room = GameService.rooms.find(room => room.id === roomId);
		if (!room) return;

		const updatedRoom = { ...room };

		// Mise à jour des coordonnées de la balle
		updatedRoom.xball += updatedRoom.xSpeed;
		updatedRoom.yball += updatedRoom.ySpeed;

		// game windows is 16/9 format - so 1.77, ball radius is 1vh

		// Gestion des collisions avec les bords (haut et bas)
		if (updatedRoom.yball > 98) {
			updatedRoom.yball = 98;
			updatedRoom.ySpeed *= -1;
		}
		if (updatedRoom.yball < 2) {
			updatedRoom.yball = 2;
			updatedRoom.ySpeed *= -1;
		}

		// Gestion des collisions avec les paddle :
		//   - paddle position : 3% du bord 
		//   - hauteur du paddle: 20% de la hauteur du canvas
		if (updatedRoom.xball >= 97 && updatedRoom.xball <= 99 && //
		updatedRoom.yball >= updatedRoom.paddleRight - 1 &&
		updatedRoom.yball <= updatedRoom.paddleRight + 21) {
			// ball radius is 1vh
			updatedRoom.xball = 97; // Je remet la balle pile à la limite [gauche] du paddle
			updatedRoom.xSpeed = Math.abs(updatedRoom.xSpeed) * -1;
			updatedRoom.ySpeed = ((updatedRoom.yball - updatedRoom.paddleRight - 5) / 6) * updatedRoom.ballSpeed; // make ball go up, straight or down based on	the part of the paddle touched
		}
		// ball collision with left paddle
		if (updatedRoom.xball >= 1 && updatedRoom.xball <= 1.5 &&
		updatedRoom.yball >= updatedRoom.paddleLeft - 1 &&
		updatedRoom.yball <= updatedRoom.paddleLeft + 21) {
			updatedRoom.xball = 1.4;
			updatedRoom.xSpeed = Math.abs(updatedRoom.xSpeed);
			updatedRoom.ySpeed = ((updatedRoom.yball - updatedRoom.paddleLeft - 5) / 6) * updatedRoom.ballSpeed;
		}
		// end of point management
		if (updatedRoom.xball >= 99) {
			updatedRoom.ScorePlayer1 += 1;
			Object.assign(room, updatedRoom);
			this.initBall(updatedRoom.id);
			return;
		}
		if (updatedRoom.xball <= 1) {
			updatedRoom.ScorePlayer2 += 1;
			Object.assign(room, updatedRoom);
			this.initBall(updatedRoom.id);
			return;
		}
		Object.assign(room, updatedRoom);
	}

	/**
	 * update paddle positions based on recorded paddle directions
	 */
	updatePaddles(roomId: number) {
		const room = GameService.rooms.find(room => room.id === roomId);
		if (!room) return; // Vérifiez si la salle a été trouvée

		// Clone de l'objet 'room'
		const updatedRoom = { ...room };

		if (updatedRoom.paddleLeftDir == 1) {
			updatedRoom.paddleLeft -= paddleSpeed;
			if (updatedRoom.paddleLeft < 0)
				updatedRoom.paddleLeft = 0;
		} else if (updatedRoom.paddleLeftDir == 2) {
			updatedRoom.paddleLeft += paddleSpeed;
			if (updatedRoom.paddleLeft > 81)
				updatedRoom.paddleLeft = 81;
		}
		if (updatedRoom.paddleRightDir == 1) {
			updatedRoom.paddleRight -= paddleSpeed;
			if (updatedRoom.paddleRight < 0)
				updatedRoom.paddleRight = 0;
		} else if (updatedRoom.paddleRightDir == 2) {
			updatedRoom.paddleRight += paddleSpeed;
			if (updatedRoom.paddleRight > 81)
				updatedRoom.paddleRight = 81;
		}
		Object.assign(room, updatedRoom);
	}

	/**
	 * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
	 */
	async updateDirection(roomId: string, client: AuthenticatedSocket, direction: string) {
		const room = GameService.rooms.find((room) => room.name === roomId);
		if (!room) return;

		// Clone de l'objet 'room'
		const updatedRoom = { ...room };

		if (client.data.name === updatedRoom.NamePlayer1) {
			if (direction === 'none') updatedRoom.paddleLeftDir = 0;
			else if (direction === 'up') updatedRoom.paddleLeftDir = 1;
			else if (direction === 'down') updatedRoom.paddleLeftDir = 2;
		} else if (client.data.name === updatedRoom.NamePlayer2) {
			if (direction === 'none') updatedRoom.paddleRightDir = 0;
			else if (direction === 'up') updatedRoom.paddleRightDir = 1;
			else if (direction === 'down') updatedRoom.paddleRightDir = 2;
		}
		Object.assign(room, updatedRoom);
	}

	async getGame(id: number)
	{ return await this.prisma.game.findUniqueOrThrow({ where: { id: id } }); }

	async getLastGames() {
		//returns a record of all the users, ordered by endTime in descending order
		const games = await this.prisma.game.findMany({
			orderBy: { endTime: 'desc' },
		});

		return games;
	}

	isInRoom(client: any) : string | boolean {
		const username = client?.data.name;
		if (!username) return false;
		for (const room of GameService.rooms)
			if (room.NamePlayer1 === username || room.NamePlayer2 === username) return room.name; // change back tu true after testing
		return false;
	}

	isInWaitlist(client: any, mode: string) {
		const username = client.data.name;
		for (const player of GameService.waitlists[mode])
			if (player.name === username) return true;
		return false;
	}

	async addToWaitlist(client: any, mode: string) {
		const username = client.data.name;
		const avatar = await this.userService.getUserByName(username).then((user) => user.image);
		const element: waitingPlayer = { name: username, socket: client, avatar: avatar };
		GameService.waitlists[mode].push(element);
	}

	removeFromWaitlist(client: any, mode: string) {
		const username = client.data.name;
		GameService.waitlists[mode] = GameService.waitlists[mode].filter((player) => player.name !== username);
	}

	generateRoomId() {
		let id = 0;
		let roomId = "room_";
		while (GameService.rooms.find((room) => room.id === id) !== undefined) id++;
		return {name: roomId + id, id: id};
	}

	async createRoomAddPlayers(roomInfo: {name, id}, mode: string) {
		const player1 = GameService.waitlists[mode][0];
		const player2 = GameService.waitlists[mode][1];
		const IdPlayer1: number = await this.userService.getUserByName(player1.name).then((user) => user.id);
		const IdPlayer2: number = await this.userService.getUserByName(player2.name).then((user) => user.id);
		player1.id = IdPlayer1; // set the id of each player to the room
		player2.id = IdPlayer2;
		const room: Room = {
			name: roomInfo.name,
			NamePlayer1: player1.name,
			player1: player1.socket,
			NamePlayer2: player2.name,
			player2: player2.socket,
			AvatarPlayer1: player1.avatar,
			AvatarPlayer2: player2.avatar,
			paddleLeft: 45,
			paddleRight: 45,
			paddleLeftDir: 0,
			paddleRightDir: 0,
			xball: 0,
			yball: 0,
			ballSpeed: 0,
			xSpeed: 0,
			ySpeed: 0,
			ScorePlayer1: 0,
			ScorePlayer2: 0,
			mode: mode,
			private: false,
			id: roomInfo.id,
		};
		player1.socket.join(room.name);
		player2.socket.join(room.name);
		GameService.rooms.push(room);
	}

	async createCustomRoomAddPlayers(
		roomInfo: {name: string, id: number},
		mode: string,
		client: AuthenticatedSocket,
		opponent: AuthenticatedSocket
	) {
		const player1 = await this.userService.getUserByName(client.data.name);
		const player2 = await this.userService.getUserByName(opponent.data.name);
		const room: Room = {
			name: roomInfo.name,
			NamePlayer1: player1.name,
			player1: client,
			NamePlayer2: player2.name,
			player2: opponent,
			AvatarPlayer1: player1.image,
			AvatarPlayer2: player2.image,
			paddleLeft: 45,
			paddleRight: 45,
			paddleLeftDir: 0,
			paddleRightDir: 0,
			xball: 0,
			yball: 0,
			ballSpeed: 0,
			xSpeed: 0,
			ySpeed: 0,
			ScorePlayer1: 0,
			ScorePlayer2: 0,
			mode: mode,
			private: true,
			id: roomInfo.id,
		};
		client.join(room.name);
		opponent.join(room.name);
		GameService.rooms.push(room);
	}

	removeUsersFromWaitlist(mode: string) {
		GameService.waitlists[mode].splice(0, 2);
	}

	sendRoomIdToUsers(roomId: {name: string, id: number}, mode: string) {
		const player1 = this.getRoomById(roomId.name, false).player1;
		const player2 = this.getRoomById(roomId.name, false).player2;
		if (!player1 || !player2) {
			console.log(!player1 ? "player 1" : "player 2", " not found!");
			return;
		}
		player1.emit('get room id', roomId);
		player2.emit('get room id', roomId);
	}

	getRoomById(roomId: string, excludeClients: boolean = true): Room | null {
		for (const room of GameService.rooms) {
			if (room.name === roomId) {
				// Create a copy of the room object
				const filteredRoom: Room = { ...room };
				if (excludeClients) {
					filteredRoom.player1 = null;
					filteredRoom.player2 = null;
					return filteredRoom;
				} else return room;
			}
		}
		return null;
	}

	getWaitlist(mode: string) { return GameService.waitlists[mode]; }

	leftOngoingGame(client: AuthenticatedSocket) {
		const username = client.data.name;
		for (const room of GameService.rooms) {
			if (room.NamePlayer1 === username || room.NamePlayer2 === username) {
				if (room.NamePlayer1 === username)
				{
					room.player1Disconnected = true;
					room.NamePlayer1 = "";
				}
				else
				{
					room.NamePlayer2 = "";
					room.player2Disconnected = true;
				}
				console.log("user ", client.data.name, " left game ", room.name);
				return true;
			}
		}
		return false;
	}

	async updateRanks() {
		const users = await this.prisma.user.findMany({
			orderBy: {
				score: 'desc',
			},
			select: {
				id: true,
				score: true,
			},
		});
		const usersId: number[] = [];
		for (const user of users) {
			if (user.score !== 1200) usersId.push(user.id);
		}

		let index = 1;
		for (const id of usersId) {
			await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					rank: index,
				},
			});
			index++;
		}
		return;
	}
}
