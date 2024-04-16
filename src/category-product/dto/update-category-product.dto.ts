import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Min, IsNumber } from 'class-validator';

export class UpdateCategoryProductDto {
  @ApiProperty({
    example: 1,
    default: 1,
    description: 'category_id',
  })
  @IsPositive()
  @Min(1)
  @IsNumber()
  currentCategory: number;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'product_id',
  })
  @IsPositive()
  @Min(1)
  @IsNumber()
  newCategory: number;
}
