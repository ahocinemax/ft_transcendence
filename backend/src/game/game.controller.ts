import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('Game')
export class GameController {
	constructor(private gameService: GameService) {}

	private logger: Logger = new Logger('GameService Log');

	// Launch a game by selecting datas from the web page
	// IDs much match with the database
	@Post('/start')
	async startGame(
		@Body('id') id: number,
		@Body('IdPlayer1') IdPlayer1: number,
		@Body('IdPlayer2') IdPlayer2: number,
		@Body('ScorePlayer1') ScorePlayer1: number,
		@Body('ScorePlayer2') ScorePlayer2: number,
		@Body('startTime') startTime: Date,
		@Body('endTime') endTime: Date,
	) { // giving the datas to the service
		const res = await this.gameService.saveGame(
			id,
			IdPlayer1,
			IdPlayer2,
			ScorePlayer1,
			ScorePlayer2,
			startTime,
			endTime,
		);
		return res;
	}

    @Get('/getGame')
    getGame(@Body('pairID') pairID: number) {
        const game = this.gameService.getGame(pairID);
        return game;
    }

    @Get('/getLastGame')
    getLastGame() {
        return (this.gameService.getLastGames());
    }
}
