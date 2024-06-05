import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { AuthModule } from '@src/auth/auth.module';
import { StoreModule } from '@src/store/store.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, StoreModule],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
