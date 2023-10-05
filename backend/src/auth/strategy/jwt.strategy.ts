import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(data: { sub: number; email: string; TwoFA_on: boolean }) {
		const user = await this.prisma.user.findUnique({ where: { id: data.sub, }, });
		if (!user.accessToken) return ;
		if (!user.otp_enabled) return user;
		if (data.TwoFA_on) return user;
	}
}
