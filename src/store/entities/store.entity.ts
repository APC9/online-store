import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/auth/entities/user.entity';
import { Category } from '@src/categories/entities/category.entity';
import { Product } from '@src/products/entities/product.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Relation,
  ManyToOne,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'store' })
export class Store {
  @ApiProperty({
    example: '1',
    description: 'Store ID auto increment',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'MyStore',
    description: 'Store name',
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    example: '+3400000000',
    description: 'phone number',
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
  })
  phone_number: string;

  @ApiProperty({
    example: 'mystore',
    description: 'slug url',
    uniqueItems: true,
    required: false,
  })
  @Column({
    type: 'varchar',
    unique: true,
  })
  slug?: string;

  @ApiProperty({
    example: 'https://encrypted-tbn0.gstatic.com/images',
    description: 'Image store',
  })
  @Column({
    type: 'varchar',
  })
  image_url: string;

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
    example: 'Description store',
    description: 'Store description',
    required: false,
  })
  @Column({
    type: 'text',
  })
  description?: string;

  @ApiProperty({
    example: '2024-03-26T17:21:11.195Z',
    description: 'Category creation date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-11-26T17:20:15.195Z',
    description: 'Category update date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
  })
  updated_at: Date;

  @ApiProperty({
    example: '1',
    description: 'userID',
    uniqueItems: true,
  })
  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user?: Relation<User>;

  @OneToMany(() => Category, (category) => category.store_id)
  categories: Relation<Category>;

  @OneToMany(() => Product, (product) => product.store)
  products?: Relation<Product>;

  @BeforeInsert() // verifica antes de insertar en la base de datos
  ckeckSlugInsert() {
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
