import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('Game')
export class GameController {
    constructor(private gameService: GameService) {}

    @Post('/start')
    async startGame(
        @Body('id') id: number,
        @Body('IdPlayer1') IdPlayer1: number,
        @Body('IdPlayer2') IdPlayer2: number,
        @Body('ScorePlayer1') ScorePlayer1: number,
        @Body('ScorePlayer2') ScorePlayer2: number,
        @Body('StartTime') StartTime: Date,
        @Body('EndTime') EndTime: Date,
    ) {
        const res = await this.gameService.saveGame(
            id,
            IdPlayer1,
            IdPlayer2,
            ScorePlayer1,
            ScorePlayer2,
            StartTime,
            EndTime,
        );
        return res;
    }

    @Get('/getGame')
    getGame(@Body('pairID') pairID: number) {
        const game = this.gameService.getGame(pairID);
        return game;
    }
}
