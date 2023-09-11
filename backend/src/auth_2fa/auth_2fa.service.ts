import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class Auth2faService {
    constructor(private readonly mailService : MailService,
                private readonly prisma: PrismaService) {}
    // async send2faMail(req, res) {}
}
