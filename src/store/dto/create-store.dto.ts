import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    example: 'MyStore',
    description: 'Store name',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: '+5800000000',
    description: 'phone number',
    uniqueItems: true,
  })
  @IsNumberString()
  phone_number: string;

  @ApiProperty({
    example: 'mystore',
    description: 'slug url',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 'https://encrypted-tbn0.gstatic.com/images',
    description: 'Image store',
  })
  @IsString()
  @IsUrl()
  image_url: string;

  @ApiProperty({
    example: 'Description store',
    description: 'Store description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
