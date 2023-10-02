// NATIVE
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// APP
import { AppController } from './app.controller';
// PRISMA
import { PrismaModule } from 'prisma/prisma.module';
// USER
import { UserModule } from './user/user.module';
// CONFIG
import configuration from './config/configuration';
// AUTH
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { Auth42Module } from './auth/auth42/auth42.module';
// CLOUDINARY
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GameModule } from './game/game.module';
//2FA
import { Auth2faModule } from './auth_2fa/auth_2fa.module';
import { FriendController } from './friend/friend.controller';
import { FriendService } from './friend/friend.service';
import { FriendModule } from './friend/friend.module';
import { BlockModule } from './block/block.module';
import { PendingService } from './pending/pending.service';
import { PendingController } from './pending/pending.controller';
import { PendingModule } from './pending/pending.module';
//chat
import { WebsocketModule } from './websocket/websocket.module';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [
        PrismaModule,
        UserModule,
        AuthModule,
        Auth42Module,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            expandVariables: true,
        }),
        CloudinaryModule,
        GameModule,
        Auth2faModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
        FriendModule,
        BlockModule,
        PendingModule,
        WebsocketModule,
        ChatModule,
      ],
  controllers: [AppController, FriendController, PendingController],
  providers: [CloudinaryService, FriendService, PendingService, ChatService],
})
export class AppModule {}
