import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

import { Profile42 } from '../interface/42.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'auth42') {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.API42_ID,
			clientSecret: process.env.API42_SECRET,
			callbackURL: process.env.API42_URI,
			profileFields: {
				id: 'id',
				username: 'login42',
				email: 'email',
				avatar: 'image',
			},
		});
	}

	validate(accessToken: string, refreshToken: string, profile: Profile42) { // are refresh tokens mandatory ?
		return profile;
	}
}
