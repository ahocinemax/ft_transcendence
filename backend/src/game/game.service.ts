import { 
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Mutex } from 'async-mutex';
import { Room } from './interface/room.interface';
import { GameData } from './interface/game-data.interface';

@Injectable()
export class GameService {
    ballSpeed = 0.25;

    constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    ) {}

    static rooms: Room[] = [];

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
			).player1Score += 1;
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
			).player2Score += 1;
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
	{
		const game = await this.prisma.game.findUniqueOrThrow({ where: { id: id, }, });
		return game;
	}

    async startGame(roomID: number, server: Server){
        const gameData = {
            paddleLeft: 0,
            paddleRight: 0,
            ballX: 0,
            ballY: 0,
            ScorePlayer1: 0,
            ScorePlayer2: 0,
            NamePlayer1: GameService.rooms.find((room) => room.id === roomID).NamePlayer1,
            NamePlayer2: GameService.rooms.find((room) => room.id === roomID).NamePlayer2,
            AvatarPlayer1: GameService.rooms.find((room) => room.id === roomID).AvatarPlayer1,
            AvatarPlayer2: GameService.rooms.find((room) => room.id === roomID).AvatarPlayer2,
            startTime: new Date(),
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
}
