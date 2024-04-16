import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'categories_products' })
export class CategoryProduct {
  @ApiProperty({
    example: '1',
    description: 'categories_products ID auto increment',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: '1',
    description: 'category_id',
    uniqueItems: true,
  })
  @Column({ type: 'int' })
  categoryId: number;

  @ApiProperty({
    example: '1',
    description: 'product_id',
    uniqueItems: true,
  })
  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  category?: Relation<Category>;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product?: Relation<Product>; //Con compilador SWC
  //product?: Relation<Product>;   Trabajar con el compilador por defecto
}
