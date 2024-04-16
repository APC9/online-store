import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export enum OAuthType {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

export class OAuthProviderDto {
  @ApiProperty({
    example: 'Fulanito',
    description: 'User name',
  })
  @IsString()
  @MinLength(2)
  first_name: string;

  @ApiProperty({
    example: 'Perez',
    description: 'User last_name',
  })
  @IsString()
  @MinLength(2)
  last_Name: string;

  @ApiProperty({
    example: 'Fulanito@mail.com',
    description: 'User email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'https://encrypted-tbn0.gstatic.com/images',
    description: 'User picture',
    required: false,
  })
  @IsString()
  picture?: string;

  @IsIn([OAuthType.FACEBOOK, OAuthType.GOOGLE])
  oauthType: OAuthType;
}
