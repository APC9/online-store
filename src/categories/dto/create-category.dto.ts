import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

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
    example: 'my_store_7',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  slug: string;
}
