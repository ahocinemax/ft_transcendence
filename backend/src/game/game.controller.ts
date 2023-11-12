import { Body, Controller, Get, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('Game')
export class GameController {
	constructor(private gameService: GameService) {}

	private logger: Logger = new Logger('GameService Log');

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
