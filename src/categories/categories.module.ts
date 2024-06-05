import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AuthModule } from '@src/auth/auth.module';
import { StoreModule } from '@src/store/store.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, StoreModule],
  exports: [TypeOrmModule, CategoriesService],
})
export class CategoriesModule {}
