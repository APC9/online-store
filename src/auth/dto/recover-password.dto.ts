import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty({
    example: 'Fulanito@mail.com',
    description: 'User email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;
}
