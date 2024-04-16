import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductService } from './category-product.service';
import { CategoryProductController } from './category-product.controller';
import { CategoryProduct } from './entities/category-product.entity';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  imports: [
    TypeOrmModule.forFeature([CategoryProduct]),
    ProductsModule,
    CategoriesModule,
  ],
  exports: [TypeOrmModule, CategoryProductService],
})
export class CategoryProductModule {}
