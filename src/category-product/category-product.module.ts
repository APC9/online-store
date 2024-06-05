import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductService } from './category-product.service';
import { CategoryProductController } from './category-product.controller';
import { CategoryProduct } from './entities/category-product.entity';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { StoreModule } from '@src/store/store.module';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  imports: [
    TypeOrmModule.forFeature([CategoryProduct]),
    ProductsModule,
    CategoriesModule,
    StoreModule,
    AuthModule,
  ],
  exports: [TypeOrmModule, CategoryProductService],
})
export class CategoryProductModule {}
