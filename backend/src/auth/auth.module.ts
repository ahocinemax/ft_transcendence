import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { Auth42Module } from "src/auth/auth42/auth42.module";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [PrismaModule, Auth42Module, UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {} 
