import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { productStatus } from '../../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Shirt',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'mystore',
    description: 'slug url',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @MinLength(1)
  slug: string;

  @ApiProperty({
    example: 'ELP-001-GRY',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  sku: string;

  @ApiProperty({
    example: 'White shirt for men',
    description: 'IsOptional',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '12.00',
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'in_stock',
    enum: [
      productStatus.IN_STOCK,
      productStatus.LOW_STOCK,
      productStatus.OUT_OF_STOCK,
    ],
  })
  @IsIn([
    productStatus.IN_STOCK,
    productStatus.LOW_STOCK,
    productStatus.OUT_OF_STOCK,
  ])
  status: productStatus;

  @ApiProperty({
    example: '50',
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  stock: number;

  @ApiProperty({
    default: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: '["https://encrypted-tbn0.gstatic.com/images"]',
    type: [String],
  })
  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  @IsOptional()
  images_urls?: string[];
}
