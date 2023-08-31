import { 
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { ScheduleHistory } from '@nestjs/schedule';
import { Mutex } from 'async-mutex';
import { Room } from './interfaces/room.interface';
import { GameData } from './interfaces/gameData.interface';

@Injectable()
export class GameService {
    constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    ) {}

    static rooms: Room[] = [];

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
