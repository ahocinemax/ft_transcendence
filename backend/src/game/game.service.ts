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

const paddleSpeed = 1;

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
	) {}

	static rooms: Room[] = [];
	static waitlists: Waitlists = {
		normal: [],
		hard: [],
		hardcore: [],
	};
	

	/**
	* Call this method when the game is over to save infos in the database
	*/
	async saveGame(
		id: number,
		IdPlayer1: number,
		IdPlayer2: number,
		ScorePlayer1: number,
		ScorePlayer2: number,
		startTime: Date,
		endTime: Date,
	) {
		const game = await this.prisma.game.create({
			data: {
				id: id,
				player1: IdPlayer1,
				player2: IdPlayer2,
				ScorePlayer1: ScorePlayer1,
				ScorePlayer2: ScorePlayer2,
				startTime: startTime,
				endTime: endTime,
			},
		});

		const duration = Math.abs(game.endTime.getTime() - game.startTime.getTime());
		await this.prisma.game.update({
			where: { id: id },
			data: { duration: duration },
		});

		;
		return game;
	}

	initBall(roomId: number) {
		const room = GameService.rooms.find(room => room.id === roomId);
		if (!room) return; // Vérifiez si la salle a été trouvée

		// Clone de l'objet 'room'
		const updatedRoom = { ...room };
		
		updatedRoom.xball = 50;
		updatedRoom.yball = 50;
		updatedRoom.ballSpeed =
			this.ballSpeed;
		updatedRoom.xSpeed =
			this.ballSpeed;
		updatedRoom.ySpeed =
			0.15 + Math.random() * this.ballSpeed;
		let direction = Math.round(Math.random());
		if (direction)
			updatedRoom.xSpeed *= -1;
		direction = Math.round(Math.random());
		if (direction)
			updatedRoom.ySpeed *= -1;
		Object.assign(room, updatedRoom);
	}

	/**
	 * update ball coordinate
	 */

	updateBall(roomId: number) {
		const room = GameService.rooms.find(room => room.id === roomId);
		if (!room) return; // Vérifiez si la salle a été trouvée
	  
		// Clone de l'objet 'room'
		const updatedRoom = { ...room };
	  
		updatedRoom.xball += updatedRoom.xSpeed;
		updatedRoom.yball += updatedRoom.ySpeed;
	  
		updatedRoom.xball += updatedRoom.xSpeed;
		updatedRoom.yball += updatedRoom.ySpeed;

		// game windows is 16/9 format - so 1.77, ball radius is 1vh

		// ball collision with floor or ceilling
		if (updatedRoom.yball > 98) {
			updatedRoom.yball = 98;
			updatedRoom.ySpeed *= -1;
		}

		if (updatedRoom.yball < 2) {
			updatedRoom.yball = 2;
			updatedRoom.ySpeed *= -1;
		}

		// ball collision with right paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
		if (updatedRoom.xball >= 97 - 2 / 1.77 &&
		updatedRoom.yball >= updatedRoom.paddleRight -1 &&
		updatedRoom.yball <= updatedRoom .paddleRight + 11) {
			// ball radius is 1vh
			updatedRoom.xball = 97 - 2 / 1.77;
			updatedRoom.ballSpeed *= 1.05;
			updatedRoom.xSpeed *= -1.05;
			updatedRoom.ySpeed = ((updatedRoom.yball - updatedRoom.paddleRight - 5) / 6) * updatedRoom.ballSpeed; // make ball go up, straight or down based on	the part of the paddle touched
		}
		// ball collision with left paddle
		if (
		updatedRoom.xball <= 3 + 2 / 1.77 &&
		updatedRoom.yball >= updatedRoom.paddleLeft - 1 &&
		updatedRoom.yball <= updatedRoom.paddleLeft + 11) {
			updatedRoom.xball = 3 + 2 / 1.77;
			updatedRoom.ballSpeed *= 1.05;
			updatedRoom.xSpeed *= -1.05;
			updatedRoom.ySpeed = ((updatedRoom.yball - updatedRoom.paddleLeft - 5) / 6) * updatedRoom.ballSpeed;
		}
		// end of point management
		if (updatedRoom.xball >= 100 + 2 / 1.77) {
			updatedRoom.ScorePlayer1 += 1;
			this.initBall(updatedRoom.id);
		}
		if (updatedRoom.xball <= 0 - 2 / 1.77) {
			updatedRoom.ScorePlayer2 += 1;
			this.initBall(updatedRoom.id);
		}
		Object.assign(room, updatedRoom);
	}

	/**
	 * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
	 */

	updateRoom(player: number, roomId: number, direction: number) {
		if (player == 1)
			GameService.rooms.find((room) => room.id === roomId).paddleLeftDir = direction;
		else
			GameService.rooms.find((room) => room.id === roomId).paddleRightDir = direction;
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
			if (updatedRoom.paddleLeft > 90)
				updatedRoom.paddleLeft = 90;
		}
		if (updatedRoom.paddleRightDir == 1) {
			updatedRoom.paddleRight -= paddleSpeed;
			if (updatedRoom.paddleRight < 0)
				updatedRoom.paddleRight = 0;
		} else if (updatedRoom.paddleRightDir == 2) {
			updatedRoom.paddleRight += paddleSpeed;
			if (updatedRoom.paddleRight > 90)
				updatedRoom.paddleRight = 90;
		}
		Object.assign(room, updatedRoom);
	}

	async getGame(id: number)
	{ return await this.prisma.game.findUniqueOrThrow({ where: { id: id } });	}

	async startGame(roomID: number, server: Server){
		const gameData: GameData = {
			paddleLeft: 0,
			paddleRight: 0,
			xBall: 0,
			yBall: 0,
			player1Score: 0,
			player2Score: 0,
			player1Name: GameService.rooms.find((room) => room.id === roomID).NamePlayer1,
			player2Name: GameService.rooms.find((room) => room.id === roomID).NamePlayer2,
			player1Avatar: GameService.rooms.find((room) => room.id === roomID).AvatarPlayer1,
			player2Avatar: GameService.rooms.find((room) => room.id === roomID).AvatarPlayer2,
			startTime: new Date(),
			gameID: roomID,
		};
		const mutex = new Mutex();
		// init ball (roomID)
		// create game loop
		return gameData;
	}

	async getLastGames() {
		//returns a record of all the users, ordered by endTime in descending order
		const games = await this.prisma.game.findMany({
			orderBy: { endTime: 'desc' },
		});

		return games;
	}

	isInRoom(client: any) {
		const username = client.data.name;
		for (const room of GameService.rooms)
			if (room.NamePlayer1 === username || room.NamePlayer2 === username) return false; // change back tu true after testing
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

	createRoomAddPlayers(roomInfo: {name, id}, mode: string) {
		const player1 = GameService.waitlists[mode][0];
		const player2 = GameService.waitlists[mode][1];
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

	removeUsersFromWaitlist(mode: string) {
		GameService.waitlists[mode].splice(0, 2);
	}

	sendRoomIdToUsers(roomId: {name: string, id: number}, mode: string) {
		const player1: waitingPlayer = GameService.waitlists[mode][0];
		const player2: waitingPlayer = GameService.waitlists[mode][1];
		player1.socket.emit('get room id', roomId);
		player2.socket.emit('get room id', roomId);
	}

	getRoomById(roomId: string, clientToExclude: AuthenticatedSocket): Room | null {
		for (const room of GameService.rooms) {
			if (room.name === roomId) {
			console.log("room found: ", room.id, " / ", room.name);

			// Créez un nouvel objet en excluant le client spécifié
			const filteredRoom: Room = {
				id: room.id,
				name: room.name,
				// player1: room.player1,
				NamePlayer1: room.NamePlayer1,
				AvatarPlayer1: room.AvatarPlayer1,
				player1Disconnected: room.player1Disconnected,
				// player2: room.player2,
				NamePlayer2: room.NamePlayer2,
				AvatarPlayer2: room.AvatarPlayer2,
				player2Disconnected: room.player2Disconnected,
				paddleLeft: room.paddleLeft,
				paddleLeftDir: room.paddleLeftDir,
				paddleRight: room.paddleRight,
				paddleRightDir: room.paddleRightDir,
				ScorePlayer1: room.ScorePlayer1,
				ScorePlayer2: room.ScorePlayer2,
				xball: room.xball,
				yball: room.yball,
				xSpeed: room.xSpeed,
				ySpeed: room.ySpeed,
				private: room.private,
				ballSpeed: room.ballSpeed,
				mode: room.mode,
			};

			// Vérifiez si le client à exclure est le joueur 1 ou le joueur 2
			if (filteredRoom.player1 === clientToExclude) {
				filteredRoom.player1 = null;
				filteredRoom.NamePlayer1 = null;
				filteredRoom.AvatarPlayer1 = null;
				// Vous pouvez également réinitialiser d'autres propriétés liées au joueur 1 si nécessaire
			}
			if (filteredRoom.player2 === clientToExclude) {
				filteredRoom.player2 = null;
				filteredRoom.NamePlayer2 = null;
				filteredRoom.AvatarPlayer2 = null;
				// Vous pouvez également réinitialiser d'autres propriétés liées au joueur 2 si nécessaire
			}
			return filteredRoom;
			}
		}
		return null;
		}


	getWaitlist(mode: string) { return GameService.waitlists[mode]; }
}
