import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { Auth2faService } from './auth_2fa.service';
import { Auth2faController } from './auth_2fa.controller';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.AUTH_2FA_MAIL,
                    pass: process.env.AUTH_2FA_PASSWORD,
                },
            },
        }),
        PrismaModule,
    ],
    controllers: [Auth2faController],
    providers: [PrismaService, Auth2faService],
})
export class Auth2faModule {}

