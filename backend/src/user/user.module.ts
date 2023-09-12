import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {  PrismaModule } from '../../prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { GameModule } from 'src/game/game.module';

@Module({
	imports: [PrismaModule, CloudinaryModule, forwardRef(() => GameModule)],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
