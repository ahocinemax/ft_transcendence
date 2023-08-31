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
        const game = await this.gameService.startGame(
            id,
            IdPlayer1,
            IdPlayer2,
            ScorePlayer1,
            ScorePlayer2,
            StartTime,
            EndTime,
        );
        return game;
    }

    @Get('/getGame')
    getGame(@Body('id') id: number) {
        const game = this.gameService.getGame(id);
        return game;
    }
}
