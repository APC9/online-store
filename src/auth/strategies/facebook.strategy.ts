import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { Profile, Strategy } from 'passport-facebook';

import { AuthService } from '../auth.service';
import { OAuthProviderDto, OAuthType } from '../dto';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  private readonly logger = new Logger('FacebookStrategy');

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_KEY'),
      clientSecret: configService.get<string>('FACEBOOK_SECRET'),
      callbackURL: 'http://localhost:3000/api/v1/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const oAuthProviderDto: OAuthProviderDto = {
      email: emails[0].value,
      first_name: name.givenName,
      last_Name: name.familyName,
      picture: photos[0].value,
      oauthType: OAuthType.FACEBOOK,
    };

    // eslint-disable-next-line prettier/prettier
    const user = await this.authService.registerUserWithGoogle(oAuthProviderDto);
    done(null, user);
  }
}
