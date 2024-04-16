import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { PaginationDto, RedisKeyProducts } from '../common';


import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManger: Cache) {}

  async create(createProductDto: CreateProductDto) {
    const { name, description, price, ...rest } = createProductDto;

    const newDescription = description ? description.toLocaleLowerCase() : '';

    try {
      const product = this.productRepository.create({
        ...rest,
        price: +price,
        name: name.toLocaleLowerCase(),
        description: newDescription,
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const ttl = 5 * 60 * 1000; // Time to live


    const usersCached: Product[] = await this.cacheManger.get(
      RedisKeyProducts.FIND_ALL,
    );

    if (usersCached) return usersCached;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
      },
    });

    await this.cacheManger.set(RedisKeyProducts.FIND_ALL, products, ttl);
    return [...products];
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException(`Product ID must be a number`);
    }
    const product = await this.productRepository.findOneBy({
      id: +id,
      isActive: true,
    });
    if (!product) throw new NotFoundException(`Product with ${id} not found`);
    return product;
  }

  async findByTerm(term: string) {
    let products: Product[];

    const searchTerm = `%${term}%`;

    const queryBuilder = this.productRepository.createQueryBuilder('product');
    // eslint-disable-next-line prefer-const
    products = await queryBuilder
      .where(
        'product.name ILIKE :searchTerm AND product.isActive = :isActive',
        {
          searchTerm,
          isActive: true,
        },
      )
      .getMany();

    if (products.length === 0)
      throw new NotFoundException(`Product with ${term} not found`);

    return [...products];
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const { name, sku, stock, description, price, status } = updateProductDto;

    const newDescription = description
      ? description.toLocaleLowerCase()
      : product.description;

    const newName = name ? name.toLocaleLowerCase() : product.name;

    const productUdated: Product = {
      ...product,
      name: newName,
      description: newDescription,
      sku,
      stock,
      status,
      price,
      updated_at: new Date(),
    };

    const productSaved = await this.productRepository.save(productUdated);

    return productSaved;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productRepository.save(product);
    return `Product with ID ${id} deleted`;
  }
}
