import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleStrategy } from './google-auth.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy]
})
export class GoogleAuthModule {}
