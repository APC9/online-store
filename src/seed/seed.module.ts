import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { CategoryProductModule } from '../category-product/category-product.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, CategoriesModule, CategoryProductModule],
})
export class SeedModule {}
