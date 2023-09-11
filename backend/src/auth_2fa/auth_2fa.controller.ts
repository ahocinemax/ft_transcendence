import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MailService } from './mail/mail.service';



@Controller('auth-2FA')
export class Auth2faController {
    constructor(
        private readonly mailService: MailService,
    ) {}

@Post('send2FAMail')
async SendMail(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.mailService.confirmationMail(req, res);
}
}
