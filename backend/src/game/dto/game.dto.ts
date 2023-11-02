import { UserDto } from 'src/user/dto/user.dto';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class SubjectiveGameDto {
	@IsNumber()
	@IsNotEmpty()
	userID: number;

	@IsNumber()
	@IsNotEmpty()
	opponentID: number;

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
	userScore: number;

	@IsNumber()
	@IsNotEmpty()
	opponentScore: number;

	@IsNotEmpty()
	victory: boolean;

	@IsNotEmpty()
	mode: string;
}
