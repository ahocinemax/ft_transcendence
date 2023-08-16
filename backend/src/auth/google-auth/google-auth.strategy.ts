import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';


type GoogleUser = {
  id: string;
  email: string;
  userName: string;
  accessToken: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService,
    private GoogleAuthService: GoogleAuthService,) {
    super({
      clientID: configService.get<string>('google.clientID'),
      clientSecret: configService.get<string>('google.clientSecret'),
      callbackURL: configService.get<string>('google.redirectUri'),
      scope: ['email', 'profile'], 
      accessType: 'offline',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { id, emails, name } = profile;
    const user: GoogleUser = {
      id,
      email: emails[0].value,
      userName: name.givenName,
      accessToken,
    };
  
    const savedUser = await this.GoogleAuthService.createDataBaseGoogleAuth(
      user.email,
      user.accessToken,
      user.userName,
      true
      );
    
    if (!savedUser) {
      done(new UnauthorizedException());
      return;
    }
  
    done(null, savedUser);
  }
}
