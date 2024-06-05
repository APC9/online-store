/* eslint-disable prettier/prettier */
/* import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { CategoryProduct } from '../category-product/entities/category-product.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(CategoryProduct)
    private readonly categoryProductRepository: Repository<CategoryProduct>,

    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertProducts();
    await this.insertCategories();
    return 'SEED EXECUTED SUCCESSFUL';
  }

  private async deleteTables() {
    const queryProducts = this.productRepository.createQueryBuilder('product');
    const queryCategories = this.productRepository.createQueryBuilder('category');
    const queryCatProd = this.categoryProductRepository.createQueryBuilder('catProd'); 

    try {
      await queryCatProd.delete().where({}).execute();
      await queryCategories.delete().where({}).execute();
      await queryProducts.delete().where({}).execute();
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async insertProducts() {
    const products = initialData.products;
    const insertPromise = [];

    products.forEach((product) => {
      insertPromise.push(this.productsService.create(product));
    });

    await Promise.all(insertPromise);

    return true;
  }

  private async insertCategories() {
    const categories = initialData.categories;
    const insertPromise = [];

    categories.forEach((category) => {
      insertPromise.push(this.categoriesService.create(category));
    });

    await Promise.all(insertPromise);

    return true;
  }
} */
