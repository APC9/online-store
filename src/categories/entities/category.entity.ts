import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CategoryProduct } from '../../category-product/entities/category-product.entity';

@Entity({ name: 'categories' })
export class Category {
  @ApiProperty({
    example: '1',
    description: 'Product ID auto increment',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: "Women's clothes",
    description: 'Category name',
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    example: "Women's clothes example description",
    description: 'Category description',
    uniqueItems: true,
    required: false,
  })
  @Column({
    type: 'text',
  })
  description?: string;

  @ApiProperty({
    example: 'true',
    description: 'Category status, { isActive: removed=false }',
    uniqueItems: true,
    default: true,
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: '1',
    description: 'ID store',
    uniqueItems: true,
  })
  @Column({
    type: 'int',
  })
  store_id: number;

  @ApiProperty({
    example: '2024-03-26T17:21:11.195Z',
    description: 'Category creation date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-11-26T17:20:15.195Z',
    description: 'Category update date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  updated_at: Date;

  @OneToMany(
    () => CategoryProduct,
    (categoryProduct) => categoryProduct.categoryId,
  )
  categoryProduct?: Relation<CategoryProduct>; //Con compilador SWC
  //categoryProduct?: CategoryProduct;    Trabajar con el compilador por defecto
}
