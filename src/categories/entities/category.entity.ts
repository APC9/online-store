/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CategoryProduct } from '../../category-product/entities/category-product.entity';
import { Store } from '@src/store/entities/store.entity';

@Entity({ name: 'categories' })
@Index(['name', 'store_id'], { unique: true })
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
  })
  @Column({
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    example: "Women's clothes example description",
    description: 'Category description',
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
    example: 'electronic',
    description: 'slug url',
    uniqueItems: true,
    required: false,
  })
  @Column({
    type: 'varchar',
  })
  slug?: string;

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

  @ManyToOne(() => Store, (store) => store.id)
  store?: Relation<Store>;

  /* 
  @JoinColumn({ name: 'store_id' }): Este decorador especifica que la columna de la relación en la tabla categories se llama store_id. De esta manera, typeorm sabrá que debe utilizar store_id como la columna de relación en lugar de crear automáticamente una columna storeId.
  */

  @BeforeInsert() // verifica antes de insertar en la base de datos
  ckeckSlugInsert?() {// al agregar ? antes de los () lo vuelvo opcional
    if (!this.slug) {
      this.slug = this.name;
    }

    this.description = this.description.toLocaleLowerCase();
    this.name = this.name.toLocaleLowerCase();

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
