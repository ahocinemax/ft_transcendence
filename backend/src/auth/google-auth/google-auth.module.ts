import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService]
})
export class GoogleAuthModule {}
