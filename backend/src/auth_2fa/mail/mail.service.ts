import { Injectable, OnModuleInit, Req, Res, HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer'
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

@Injectable()
export class MailService implements OnModuleInit {
    private transporter;

    // onModuleInit() {
        // this.transporter = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 465,
            // auth:{
                // user: process.env.AUTH_2FA_MAIL,
                // pass: process.env.AUTH_2FA_PASSWORD,
            // },
        // });
    // }
    
    async onModuleInit() {
        const oauth2Client = new OAuth2(
            process.env.AUTH_2FA_CLIENT,
            process.env.AUTH_2FA_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.AUTH_2FA_REFRESH_TOKEN
        });

        const accessToken = await oauth2Client.getAccessToken();

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.AUTH_2FA_MAIL,
                clientId: process.env.AUTH_2FA_CLIENT,
                clientSecret: process.env.AUTH_2FA_SECRET,
                refreshToken: process.env.AUTH_2FA_REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });
    }

    async confirmationMail(@Req() req: Request, @Res() res: Response)
    {
        try {
            const email = 'tsujimarico@gmail.com';
            const code2FA = '123456';
            this.sendMail(email, req, code2FA);
        }
        catch(error) {
            console.log("sending Mail error", error);
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Invalid sending mail"},
                HttpStatus.BAD_REQUEST);
            }
        }

    async sendMail(email: string, req: Request, code2FA: string) {
        const info = await this.transporter.sendMail({
            from: '69.rue.du.dr.bauer@gmail.com',
            to: `${email}`,
            subject: 'Confirmation Mail',
            code2FA,
            text: 'test test test'
        });
        console.log("Message sent: %s", info.messageId);
    }
}
