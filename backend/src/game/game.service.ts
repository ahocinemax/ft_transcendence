import { 
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';
// import { SchedulerRegistry } from '@nestjs/schedule';
import { Mutex } from 'async-mutex';
import { Room } from './interface/room.interface';
// import { GameData } from './interface/game-data.interface';
import { waitingPlayer } from './interface/player.interface';
import { GameData } from './interface/game-data.interface';

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
		NamePlayer1: number,
		NamePlayer2: number,
		ScorePlayer1: number,
		ScorePlayer2: number,
		startTime: Date,
		endTime: Date,
	) {
		const game = await this.prisma.game.create({
			data: {
				id: id,
				player1: NamePlayer1,
				player2: NamePlayer2,
				ScorePlayer1: ScorePlayer1,
				ScorePlayer2: ScorePlayer2,
				startTime: startTime,
				endTime: endTime,
			},
		});

		const duration = Math.abs(game.endTime.getTime() - game.startTime.getTime());
		await this.prisma.game.update({
			where: { id: id, },
			data: { duration: duration, },
		});

		
		return game;
	}

	initBall(roomId: number) {
		GameService.rooms.find((room) => room.id === roomId).xball = 50;
		GameService.rooms.find((room) => room.id === roomId).yball = 50;
		GameService.rooms.find((room) => room.id === roomId).ballSpeed =
			this.ballSpeed;
		GameService.rooms.find((room) => room.id === roomId).xSpeed =
			this.ballSpeed;
		GameService.rooms.find((room) => room.id === roomId).ySpeed =
			0.15 + Math.random() * this.ballSpeed;
		let direction = Math.round(Math.random());
		if (direction)
			GameService.rooms.find((room) => room.id === roomId).xSpeed *= -1;
		direction = Math.round(Math.random());
		if (direction)
			GameService.rooms.find((room) => room.id === roomId).ySpeed *= -1;
	}

	/**
	 * update ball coordinate
	 */

	updateBall(roomId: number) {
		GameService.rooms.find((room) => room.id === roomId).xball +=
			GameService.rooms.find((room) => room.id === roomId).xSpeed;
		GameService.rooms.find((room) => room.id === roomId).yball +=
			GameService.rooms.find((room) => room.id === roomId).ySpeed;

		// game windows is 16/9 format - so 1.77, ball radius is 1vh

		// ball collision with floor or ceilling
		if (GameService.rooms.find((room) => room.id === roomId).yball > 98) {
			GameService.rooms.find((room) => room.id === roomId).yball = 98;
			GameService.rooms.find((room) => room.id === roomId).ySpeed *= -1;
		}

		if (GameService.rooms.find((room) => room.id === roomId).yball < 2) {
			GameService.rooms.find((room) => room.id === roomId).yball = 2;
			GameService.rooms.find((room) => room.id === roomId).ySpeed *= -1;
		}

		// ball collision with right paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
		if (
			GameService.rooms.find((room) => room.id === roomId).xball >=
				97 - 2 / 1.77 &&
			GameService.rooms.find((room) => room.id === roomId).yball >=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight -
					1 &&
			GameService.rooms.find((room) => room.id === roomId).yball <=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight +
					11
		) {
			// ball radius is 1vh
			GameService.rooms.find((room) => room.id === roomId).xball =
				97 - 2 / 1.77;
			GameService.rooms.find(
				(room) => room.id === roomId,
			).ballSpeed *= 1.05;
			GameService.rooms.find((room) => room.id === roomId).xSpeed *=
				-1.05;
			GameService.rooms.find((room) => room.id === roomId).ySpeed =
				((GameService.rooms.find((room) => room.id === roomId).yball -
					GameService.rooms.find((room) => room.id === roomId)
						.paddleRight -
					5) /
					6) *
				GameService.rooms.find((room) => room.id === roomId).ballSpeed; // make ball go up, straight or down based on  the part of the paddle touched
		}
		// ball collision with left paddle
		if (
			GameService.rooms.find((room) => room.id === roomId).xball <=
				3 + 2 / 1.77 &&
			GameService.rooms.find((room) => room.id === roomId).yball >=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft -
					1 &&
			GameService.rooms.find((room) => room.id === roomId).yball <=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft +
					11
		) {
			GameService.rooms.find((room) => room.id === roomId).xball =
				3 + 2 / 1.77;
			GameService.rooms.find(
				(room) => room.id === roomId,
			).ballSpeed *= 1.05;
			GameService.rooms.find((room) => room.id === roomId).xSpeed *=
				-1.05;
			GameService.rooms.find((room) => room.id === roomId).ySpeed =
				((GameService.rooms.find((room) => room.id === roomId).yball -
					GameService.rooms.find((room) => room.id === roomId)
						.paddleLeft -
					5) /
					6) *
				GameService.rooms.find((room) => room.id === roomId).ballSpeed;
		}
		// end of point management
		if (
			GameService.rooms.find((room) => room.id === roomId).xball >=
			100 + 2 / 1.77
		) {
			GameService.rooms.find(
				(room) => room.id === roomId,
			).ScorePlayer1 += 1;
			this.initBall(
				GameService.rooms.find((room) => room.id === roomId).id,
			);
		}
		if (
			GameService.rooms.find((room) => room.id === roomId).xball <=
			0 - 2 / 1.77
		) {
			GameService.rooms.find(
				(room) => room.id === roomId,
			).ScorePlayer2 += 1;
			this.initBall(
				GameService.rooms.find((room) => room.id === roomId).id,
			);
		}
	}

	/**
	 * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
	 */

	updateRoom(player: number, roomId: number, direction: number) {
		if (player == 1)
			GameService.rooms.find((room) => room.id === roomId).paddleLeftDir =
				direction;
		else
			GameService.rooms.find(
				(room) => room.id === roomId,
			).paddleRightDir = direction;
	}

	/**
	 * update paddle positions based on recorded paddle directions
	 */

	updatePaddles(roomId: number) {
		if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleLeftDir == 1
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleLeft -=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft < 0
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleLeft = 0;
		} else if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleLeftDir == 2
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleLeft +=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft > 90
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleLeft = 90;
		}
		if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleRightDir == 1
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleRight -=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight < 0
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleRight = 0;
		} else if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleRightDir == 2
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleRight +=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight > 90
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleRight = 90;
		}
	}

	async getGame(id: number)
	{ return await this.prisma.game.findUniqueOrThrow({ where: { id: id, }, });	}

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

	getWaitlist(mode: string) { return GameService.waitlists[mode]; }

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
}
