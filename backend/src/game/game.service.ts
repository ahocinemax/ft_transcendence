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
        StartTime: Date,
        EndTime: Date,
    ) {
        const game = await this.prisma.game.create({
            data: {
                id: id,
                player1: IdPlayer1,
                player2: IdPlayer2,
                ScorePlayer1: ScorePlayer1,
                ScorePlayer2: ScorePlayer2,
                StartTime: StartTime,
                EndTime: EndTime,
            },
        });
        return game;
    }

    async getGame(id: number) {
		try {
			const game = await this.prisma.game.findUnique({
				where: {
					id: id,
				},
				rejectOnNotFound: true,
			});
			return game;
		} catch (error) {
			throw new ForbiddenException('getGame error : ' + error);
		}
	}

    async startGame(roomID: number, server: Server) {
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

    }
}