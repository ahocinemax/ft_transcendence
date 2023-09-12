import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { Auth2faService } from './auth_2fa.service';
import { Auth2faController } from './auth_2fa.controller';
import { MailService } from './mail/mail.service';
import { ConfirmService } from './confirm/confirm.service';

@Module({
    imports: [PrismaModule],
    controllers: [Auth2faController],
    providers: [PrismaService, Auth2faService, MailService, ConfirmService],
})
export class Auth2faModule {}

