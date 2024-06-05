import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Fulanito',
    description: 'User name',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    example: 'Perez',
    description: 'User last_name',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  last_Name?: string;

  @ApiProperty({
    example: '+5800000000',
    description: 'phone number',
    uniqueItems: true,
  })
  @IsNumberString()
  @IsOptional()
  phone_number?: string;
}
