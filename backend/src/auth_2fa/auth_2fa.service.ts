import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class Auth2faService {
    constructor(private readonly mailerService : MailerService,
                private prisma: PrismaService) {}
    // async send2faMail(req, res) {}
}
