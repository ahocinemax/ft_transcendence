import { Injectable, OnModuleInit, Req, Res, HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer'
import { google } from 'googleapis';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

const OAuth2 = google.auth.OAuth2;
const htmlForMail = fs.readFileSync('/usr/src/app/src/auth_2fa/mail/mailFor2FA.html', 'utf8');

@Injectable()
export class MailService implements OnModuleInit {
    private transporter;
    constructor(private readonly prisma: PrismaService) {}   
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
            //const email = 'tsujimarico@gmail.com';
            const email = await this.getMailFromReq(req);
            const code2FA = this.generateCode2FA(6);
            this.sendMail(email, req, code2FA);
            await this.stockCodeWithHash(code2FA, req)
			res.status(200).json({
				email,
		});
        }
        catch(error) {
            console.log("sending Mail error", error);
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Invalid sending mail"},
                HttpStatus.BAD_REQUEST);
            }
    }
    
    async getMailFromReq(req: Request): Promise<string> {
        try {
            const user = await this.prisma.user.findUnique({
            where: {
                name: req.body.name,
            },});
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Invalid user"},
                    HttpStatus.BAD_REQUEST);
            }
        return user?.email!;
        }
        catch (error)
        {
            console.log("getMailFromReq error", error);
            throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Invalid Email adress',
				},
				HttpStatus.BAD_REQUEST
                );
        }
    }

    generateCode2FA(length: number): string {
        const characters = '0123456789';
        let pinCode = '';
    
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          pinCode += characters[randomIndex];
        }
        return pinCode;
      }

    async sendMail(email: string, req: Request, code2FA: string) {
        const userName = req.body.name;
        let customizedHtmlContent = htmlForMail.replace('{{code2FA}}', code2FA);
        customizedHtmlContent = customizedHtmlContent.replace('{{userName}}', userName);
        const info = await this.transporter.sendMail({
            from: 'ft_transcendence<69.rue.du.dr.bauer@gmail.com>',
            to: `${email}`,
            subject: 'Confirmation your code for 2FA',
            //code2FA: `${code2FA}`,
            //text: `test your code is ${code2FA}`,
            html: customizedHtmlContent,
        });
        console.log("Message sent: %s", info.messageId);
    }

    async stockCodeWithHash(code2FA: string, @Req() req: Request)
	{
		try {
			const saltOrRounds = 10;
			const password = code2FA;
            console.log("password", code2FA);
			const userName  = req.body.name;
            //console.log("userName", userName);
			const hash = await bcrypt.hash(password, saltOrRounds);
			await this.prisma.user.update({
				where: { name:  userName},
				data: {otp_code: hash},
			})
		} catch(error) {
            console.log("stockCodeWithHash error", error);
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Error to store email in database"},
				HttpStatus.BAD_REQUEST);
		}
	}
}
//"$2b$10$rMFAJ9NT.7dPA84ey/oM7eXr8I7tF3G97qXf1F3iab7gQrPjEXL/W"
//"$2b$10$6.i8GxD1QjXjq60Y6eWQZuxPhwQFANnUg5yHiKUTC6lOYvXj53zfS"