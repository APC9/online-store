import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class GetUserByEmailDto {
  @ApiProperty({
    example: 'email@example.com',
    required: true,
  })
  @IsEmail()
  @Type(() => String)
  email: string;
}
