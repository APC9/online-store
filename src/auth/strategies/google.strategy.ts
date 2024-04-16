import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';
import { OAuthProviderDto, OAuthType } from '../dto/oauth-provider.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger('GoogleStrategy');

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: 'http://localhost:3000/api/v1/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const oAuthProviderDto: OAuthProviderDto = {
      email: emails[0].value,
      first_name: name.givenName,
      last_Name: name.familyName,
      picture: photos[0].value,
      oauthType: OAuthType.GOOGLE,
    };

    // eslint-disable-next-line prettier/prettier
    const user = await this.authService.registerUserWithGoogle(oAuthProviderDto);
    done(null, user);
  }
}

// ver la configuracion de google en el video de angualar Avanzado en
// udemy Nro 144
