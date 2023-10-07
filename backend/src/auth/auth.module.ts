import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { Auth42Module } from "src/auth/auth42/auth42.module";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { GoogleAuthService } from "./google-auth/google-auth.service";
import { GameModule } from "src/game/game.module";

@Module({
  imports: [PrismaModule, Auth42Module, UserModule, GoogleAuthModule, GameModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, GoogleAuthService],
  exports: [AuthService],
})
export class AuthModule {} 
