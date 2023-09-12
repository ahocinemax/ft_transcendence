import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { GameService } from 'src/game/game.service';
import { GameController } from 'src/game/game.controller';

@Module({
	imports: [PrismaModule, CloudinaryModule],
	controllers: [UserController, GameController],
	providers: [UserService, GameService],
	exports: [UserService],
})
export class UserModule {}
