import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from 'src/user/user.module';
import { AppModule } from 'src/app.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { WatchController } from './watch/watch.controller';
import { GameGateway } from './game.gateway';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => AppModule),
        forwardRef(() => UserModule),

    ],
    providers: [GameService, GameGateway],
    controllers: [WatchController, GameController],
    exports: [GameService],
})
export class GameModule {}
