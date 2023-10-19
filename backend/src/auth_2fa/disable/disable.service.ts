import { Injectable, OnModuleInit, Req, Res, HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';

@Injectable()
export class DisableService {
    constructor(private readonly prisma: PrismaService) {}  

    async disable2FA(@Req() req: Request, @Res() res: Response)
    {
        try{
            const disableUser = await this.updateUser(req);
            console.log("disableUser", disableUser);
            res.status(200).json({
				message: 'OK',
                user: {
                    id: disableUser.id,
                    name: disableUser.name,
                    email: disableUser.email,
                    otp_enabled: disableUser.otp_enabled,
                    otp_validated: disableUser.otp_validated,
                }
            });
        } catch (error) {
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
			console.log("name", name);
			const user = await this.prisma.user.update({
				where: {name: name},
                data: {
					otp_enabled: false,
                    otp_validated: false,
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
