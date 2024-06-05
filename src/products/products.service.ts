import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { User } from '@src/auth/entities/user.entity';
import { StoreService } from '@src/store/store.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
    private readonly storeService: StoreService,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { name, description, price, slug, ...rest } = createProductDto;

    const store = await this.storeService.findOneStoreBySlugAndUSerId(
      slug,
      user,
    );

    if (store instanceof NotFoundException) {
      return store; // Retorna la ecepcion
    }

    const storeId = store.id;
    try {
      const product = this.productRepository.create({
        ...rest,
        price: +price,
        name,
        description,
        storeId,
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const ttl = 5 * 60 * 1000; // Time to live

    const totalPages = await this.productRepository.count({
      where: { isActive: true },
    });

    const lastPage = Math.ceil(totalPages / limit);

    const usersCached: Product[] = await this.cacheManger.get(
      RedisKeyProducts.FIND_ALL,
    );

    if (usersCached && usersCached['data'].length === totalPages)
      return usersCached;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
      },
    });

    const metadata = {
      data: [...products],
      meta: {
        total: totalPages,
        offset,
        lastPage,
      },
    };

    await this.cacheManger.set(RedisKeyProducts.FIND_ALL, metadata, ttl);

    return metadata;
  }

  async findAllByStore(paginationDto: PaginationDto, term: string) {
    const { limit = 10, offset = 0 } = paginationDto;
    const ttl = 5 * 60 * 1000; // Time to live

    const store = await this.storeService.findOneBySlugStore(term);

    if (store instanceof NotFoundException) {
      return store; // Retorna la ecepcion
    }

    const storeId = store.stores[0].id;

    const totalPages = await this.productRepository.count({
      where: {
        isActive: true,
        storeId,
      },
    });

    const lastPage = Math.ceil(totalPages / limit);

    const usersCached: Product[] = await this.cacheManger.get(
      RedisKeyProducts.FIND_ALL,
    );

    if (usersCached && usersCached['data'].length === totalPages)
      return usersCached;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
        storeId,
      },
    });

    const metadata = {
      data: [...products],
      meta: {
        total: totalPages,
        offset,
        lastPage,
      },
    };

    await this.cacheManger.set(RedisKeyProducts.FIND_ALL, metadata, ttl);

    return metadata;
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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
    url_slug: string,
  ) {
    const { name, sku, stock, description, price, status } = updateProductDto;

    try {
      const store = await this.storeService.findOneStoreBySlugAndUSerId(
        url_slug,
        user,
      );

      if (store instanceof NotFoundException) {
        return store; // Retorna la ecepcion
      }

      const storeId = store.id;

      const product = await this.productRepository.findOne({
        where: {
          id,
          storeId,
          isActive: true,
        },
      });

      if (!product) {
        return new BadRequestException(
          `Product with id ${id} not found in this store: ${store.name}`,
        );
      }

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
        slug: name.toLowerCase().replaceAll(' ', '_').replaceAll("'", ''),
        updated_at: new Date(),
      };

      const productSaved = await this.productRepository.save(productUdated);

      return productSaved;
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }

  async remove(id: number, user: User, slug: string) {
    try {
      const store = await this.storeService.findOneStoreBySlugAndUSerId(
        slug,
        user,
      );

      if (store instanceof NotFoundException) {
        return store; // Retorna la ecepcion
      }

      const storeId = store.id;

      const product = await this.productRepository.findOne({
        where: {
          id,
          storeId,
          isActive: true,
        },
      });

      if (!product) {
        return new BadRequestException(
          `Product with id ${id} not found in this store: ${store.name}`,
        );
      }

      product.isActive = false;
      await this.productRepository.save(product);
      return `Product with ID ${id} deleted`;
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }
}
