// NATIVE
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// APP
import { AppController } from './app.controller';
import { AppService } from './app.service';
// PRISMA
import { PrismaModule } from 'prisma/prisma.module';
// USER
import { UserModule } from './user/user.module';
// CONFIG
import configuration from './config/configuration';
// AUTH
import { AuthModule } from './auth/auth.module';
import { Auth42Module } from './auth/auth42/auth42.module';
// CLOUDINARY
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GameModule } from './game/game.module';

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
      ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
