import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Auth42Module } from './auth/auth42/auth42.module';

@Module({
  imports: [
        PrismaModule,
        UserModule,
        AuthModule,
        Auth42Module,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
