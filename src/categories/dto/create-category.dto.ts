import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: "Women's clothes",
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: "Women's clothes example description",
    description: 'IsOptional',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    default: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: '1',
    minimum: 1,
  })
  @Min(1)
  @IsNumber()
  store_id: number;
}
