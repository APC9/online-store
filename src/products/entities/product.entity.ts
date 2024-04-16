import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { productStatus } from '../../interfaces';
import { CategoryProduct } from '../../category-product/entities/category-product.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '1',
    description: 'Product ID auto increment',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Shirt',
    description: 'Product name',
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    example: 'ELP-001-GRY',
    description: 'SKU code',
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
  })
  sku: string;

  @ApiProperty({
    example: 'White shirt for men',
    description: 'Product description',
    uniqueItems: true,
    required: false,
  })
  @Column({
    type: 'text',
  })
  description?: string;

  @ApiProperty({
    example: '12.00',
    description: 'Price of the product',
    uniqueItems: true,
  })
  @Column({
    type: 'float',
  })
  price: number;

  @ApiProperty({
    example: 'in_stock',
    description: 'Product status',
    uniqueItems: true,
    default: 'In Stock',
    enum: ['in_stock', 'out_of_stock', 'low_stock'],
  })
  @Column({
    type: 'enum',
    enum: productStatus,
    default: productStatus.IN_STOCK,
  })
  status: productStatus;

  @ApiProperty({
    example: '50',
    description: 'Quantity of product in stock',
    uniqueItems: true,
  })
  @Column({
    type: 'int',
  })
  stock: number;

  @ApiProperty({
    example: 'true',
    description: 'product status, { isActive: removed=false }',
    uniqueItems: true,
    default: true,
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: '[https://encrypted-tbn0.gstatic.com/images]',
    description: 'Product images',
    uniqueItems: true,
    required: false,
  })
  @Column({
    type: 'text',
    array: true,
  })
  images_urls?: string[];

  @ApiProperty({
    example: '2024-03-26T17:21:11.195Z',
    description: 'Product creation date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-11-26T17:20:15.195Z',
    description: 'Product update date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  updated_at: Date;

  @OneToMany(
    () => CategoryProduct,
    (categoryProduct) => categoryProduct.productId,
  )
  categoryProduct?: Relation<CategoryProduct>; //Con compilador SWC
  //categoryProduct?: CategoryProduct;    Trabajar con el compilador por defecto
}
