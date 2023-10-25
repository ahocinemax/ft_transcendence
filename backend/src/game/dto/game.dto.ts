import { UserDto } from 'src/user/dto/user.dto';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class SubjectiveGameDto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsNumber()
	@IsNotEmpty()
	player1: number;

	@IsNumber()
	@IsNotEmpty()
	player2: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(65_000)
	opponentAvatar: string;

	@IsString()
	@IsNotEmpty()
	opponentUsername: string;

	@IsString()
	@IsNotEmpty()
	opponentUser: UserDto;

	@IsNumber()
	@IsNotEmpty()
	opponentRank: number;

	@IsNumber()
	@IsNotEmpty()
	duration: number;

	@IsNumber()
	@IsNotEmpty()
	ScorePlayer1: number;

	@IsNumber()
	@IsNotEmpty()
	ScorePlayer2: number;

	@IsNotEmpty()
	victory: boolean;
}
