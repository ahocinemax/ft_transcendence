import {
	ForbiddenException,
	BadRequestException,
	Inject,
	forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Game, User } from '@prisma/client';

import { GameService } from 'src/game/game.service';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
	) {}

	async getAllUsers() {
		return await this.prisma.user.findMany();
	}

	async getUserByName(name: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					name: name,
				},
			})
			console.log(name);
			console.log(user);
			return user;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Error to find user by name',
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async deleteAllUsers() {
		try {
			const user = await this.prisma.user.deleteMany({});
			return user;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Error to delete all user',
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async getGameHistory(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const gameHistoryInt: number[] = user.gameHistory;
		if (gameHistoryInt.length === 0) return [];
		const gameHistory: Game[] = [];
		for (const gameID of gameHistoryInt)
			gameHistory.push(await this.gameService.getGame(gameID));
		
		const gameDTOs: SubjectiveGameDTO[] = [];

		for (const game of gameHistory) {
			let opponentScore: number;
			let opponentID: number;
			let userScore: number;

			game.player1 === id ? (opponentID = game.player2) : (opponentID = game.player1);
			game.player1 === id ? (userScore = game.ScorePlayer1) : (userScore = game.ScorePlayer2);
			game.player1 === id ? (opponentScore = game.ScorePlayer2) : (opponentScore = game.ScorePlayer1);
			const opponent: UserDTO = await this.getUser(opponentID);

			const gameDTO: SubjectiveGameDTO = {
				userID: game.id,


		try {

		}
		catch (error) {}
	}

	async getUser(id: number) {
		if (id === undefined)
			throw new BadRequestException('getUser error : id is undefined');
		try {
			const user = await this.prisma.user.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			const dtoUser = plainToClass(UserDTO, user);
			return dtoUser;
		}

}
