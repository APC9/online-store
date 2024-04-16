import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCategoryProductDto {
  @ApiProperty({
    example: 1,
    default: 1,
    description: 'category_id',
  })
  @IsPositive()
  @Min(1)
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'product_id',
  })
  @IsPositive()
  @Min(1)
  @IsNumber()
  productId: number;
}
