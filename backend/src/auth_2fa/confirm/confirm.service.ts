import { Injectable, OnModuleInit, Req, Res, HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer'
import { google } from 'googleapis';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ConfirmService {
    constructor(private readonly prisma: PrismaService) {}  
	
    async validate2FA(@Req() req: Request, @Res() res: Response)
    {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: req.body.name,
                }});
            const otp_code = user?.otp_code;
            //console.log("otp_code", otp_code);
            const { hash } = req.body;
            console.log("hash", hash);
            //console.log("req.body", req.body);
            const valid = await bcrypt.compare(hash, otp_code);
            //console.log("valid", valid);
            if (valid) {
                //console.log("req", req.body);
                await this.updateUser(req);
                res.status(200).json({message: 'OK'});
            }
            else {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Invalid code2FA"},
                    HttpStatus.BAD_REQUEST);
            }
        }
        catch(error) {
            console.log("sending code error", error);
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Invalid code 2FA"},
                HttpStatus.BAD_REQUEST);
            }
    }

    async updateUser(req: Request) {
		try{
			const name   = req.body.name;
			const user = await this.prisma.user.update({
				where: {name: name},
                data: {
					otp_enabled: true,
                    otp_verified: true,
                    otp_validated: true
				},
			});
			if (!user) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Error to update user in system 2FA',
					},
					HttpStatus.BAD_REQUEST
				);
			}
		return user;
		} catch (error) {
		throw new HttpException(
			{
				status: HttpStatus.BAD_REQUEST,
				error: 'Error to update user in system 2FA',
			},
			HttpStatus.BAD_REQUEST
		);
	}
	}
}
