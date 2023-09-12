import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { GameModule } from 'src/game/game.module';
import { UserService } from './user.service';

@Module({
	imports: [GameModule, forwardRef(() => PrismaModule), CloudinaryModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})

export class UserModule {}
