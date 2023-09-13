import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MailService } from './mail/mail.service';
import { ConfirmService } from './confirm/confirm.service';
import { DisableService } from './disable/disable.service';


@Controller('auth-2FA')
export class Auth2faController {
    constructor(
        private readonly mailService: MailService,
        private readonly confirmService: ConfirmService,
        private readonly DisableService: DisableService,
    ) {}

@Post('send2FAMail')
async SendMail(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.mailService.confirmationMail(req, res);
}
@Post('conFirmCode')
async confirm2Fa(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.confirmService.validate2FA(req, res);
}

@Post('disable2FA')
async disable2FA(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.DisableService.disable2FA(req, res);
}
}