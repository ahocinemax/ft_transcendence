import
{
	ForbiddenException,
	BadRequestException,
	Inject,
	forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Game, User } from '@prisma/client';
import { plainToClass } from 'class-transformer';

import { GameService } from 'src/game/game.service';
import { SubjectiveGameDto } from 'src/game/dto/game.dto';
import { UserDto } from './dto/user.dto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { triggerAsyncId } from 'async_hooks';

@Injectable({})
export class UserService
{
	constructor(
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
	) {}

	async createUser(
		email: string,
		name: string,
		hash: string,
		id: 0, // auto-incremented
	): Promise<User> {
		const user = this.prisma.user.create({
			data: {
				email,
				name,
				hash,
				id42: id,
			},
		});
		return (user);
	}

	async getAllUsers()
	{
		return (await this.prisma.user.findMany());
	}

	async getFriends(id: number)
	{
		const friendIDList = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select: {
				friends: true,
			},
		});
		const friendList: UserDto[] = [];
		for (const elem of friendIDList)
		{
			for (let i = 0 ; i < elem.friends.length ; i++)
			{
				const friend = await this.prisma.user.findUnique({
					where: {
						id: elem.friends[i],
					}
				});
				const dtoUser = plainToClass(UserDto, friend);
				friendList.push(dtoUser);
			}
		}
		return (friendList);
	}

	async getUserByName(name: string)
	{
		try
		{
			const user = await this.prisma.user.findFirst({
				where:
				{
					name: name,
				},
			})
			console.log(name);
			console.log(user);
			return (user);
		}
		catch (error)
		{
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Error to find user by name',
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async deleteAllUsers()
	{
		try
		{
			const user = await this.prisma.user.deleteMany({});
			return user;
		}
		catch (error)
		{
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Error to delete all user',
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async getLeaderBoard()
	{
		// return all users id sorted by rank
		const users = await this.prisma.user.findMany({
			where: {
				NOT: {
					gamesPlayed: {
						equals: 0,
					},
				},
			},
			select: {
				id: true,
				username: true,
				rank: true,
				winRate: true,
				gamesPlayed: true,
				gamesWon: true,
				gamesLost: true,
			},
			orderBy: {rank: 'asc'},
		});
		return (users);
	}

	// Use prisma to find the user on DB
	async getGameHistory(id: number)
	{
		const user = await this.prisma.user.findUnique({
			where:
			{
				id: id,
			},
		});

		// Get the size of the game history (number of games played)
		const gameHistoryInt: number[] = user.gameHistory;
		if (gameHistoryInt.length === 0) return [];

		// Initialize the game history + push each gameID into the array
		const gameHistory: Game[] = [];
		for (const gameID of gameHistoryInt)
			gameHistory.push(await this.gameService.getGame(gameID));

		const gameDTOs: SubjectiveGameDto[] = [];

		for (const game of gameHistory)
		{
			let opponentScore: number;
			let opponentID: number;
			let userScore: number;

			game.player1 === id ? (opponentID = game.player2) : (opponentID = game.player1);
			game.player1 === id ? (userScore = game.ScorePlayer1) : (userScore = game.ScorePlayer2);
			game.player1 === id ? (opponentScore = game.ScorePlayer2) : (opponentScore = game.ScorePlayer1);
			const opponent: UserDto = await this.getUser(opponentID);

			const gameDTO: SubjectiveGameDto =
			{
				duration: game.duration,

				userScore: userScore,
				userID: id,

				opponentUsername: opponent.username,
				opponentAvatar: opponent.avatar,
				opponentScore: opponentScore,
				opponentRank: opponent.rank,
				opponentID: opponent.id,
				opponentUser: opponent,
				victory: userScore > opponentScore ? true : false,
			};
			gameDTOs.push(gameDTO);
		}
		return gameDTOs;
	}

	async getUser(id: number)
	{
		if (id === undefined)
			throw new BadRequestException('getUser error : id is undefined');
		const user = await this.prisma.user.findUniqueOrThrow({
			where:
			{
				id: id,
			},
		});
		const dtoUser = plainToClass(UserDto, user);
		return dtoUser;
	}

}
