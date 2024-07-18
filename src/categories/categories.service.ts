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

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto, RedisKeyCategories } from '../common';
import { Category } from './entities/category.entity';
import { StoreService } from '@src/store/store.service';
import { User } from '@src/auth/entities/user.entity';
import { Store } from '@src/store/entities/store.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
    private readonly storeService: StoreService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const { name, description, slug } = createCategoryDto;

    const existStore = await this.storeService.findOneStoreBySlugAndUSerId(
      slug,
      user,
    );

    if (existStore instanceof NotFoundException) {
      return existStore; // Retorna la ecepcion
    }

    const store: Store = existStore['stores'];

    try {
      const category = this.categoryRepository.create({
        isActive: true,
        name,
        description,
        store_id: store.id,
      });
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message.includes('IDX_8afaa45e2e49aae4eb2ac0e68b'))
        return new BadRequestException(`Duplicate category for this store.`);

      throw new InternalServerErrorException(
        `Contact administrator: ${error.message}`,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const ttl = 1 * 60 * 1000; // Time to live
    const totalPages = await this.categoryRepository.count({
      where: { isActive: true },
    });
    const lastPage = Math.ceil(totalPages / limit);

    const usersCached: Category[] = await this.cacheManger.get(
      RedisKeyCategories.FIND_ALL_CATEG,
    );

    if (usersCached && usersCached['data'].length === totalPages)
      return usersCached;

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
      },
    });

    const metadata = {
      data: [...categories],
      meta: {
        total: totalPages,
        offset,
        lastPage,
      },
    };

    await this.cacheManger.set(
      RedisKeyCategories.FIND_ALL_CATEG,
      metadata,
      ttl,
    );

    return metadata;
  }

  async findOne(categoryId: number, idStore?: number) {
    if (isNaN(categoryId)) {
      throw new BadRequestException(`Category ID must be a number`);
    }

    const findOptions: any = {
      id: +categoryId,
      isActive: true,
    };

    if (idStore !== undefined) {
      findOptions.store_id = idStore;
    }

    const category = await this.categoryRepository.findOneBy(findOptions);

    if (!category)
      throw new NotFoundException(`Category with ${categoryId} not found`);

    return category;
  }

  async findByTerm(term: string) {
    let categories: Category[];

    const searchTerm = `%${term}%`;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    // eslint-disable-next-line prefer-const
    categories = await queryBuilder
      .where(
        'category.name ILIKE :searchTerm AND category.isActive = :isActive',
        {
          searchTerm,
          isActive: true,
        },
      )
      .getMany();

    if (categories.length === 0)
      throw new NotFoundException(`Category with ${term} not found`);

    return [...categories];
  }

  // eslint-disable-next-line prettier/prettier
  async getAllCategoriesByStoreSlug(paginationDto: PaginationDto, term: string) {
    const { limit = 10, offset = 0 } = paginationDto;
    const ttl = 5 * 60 * 1000; // Time to live

    const store = await this.storeService.findOneBySlugStore(term);

    if (store instanceof NotFoundException) {
      return store; // Retorna la ecepcion
    }

    const usersCached: Category[] = await this.cacheManger.get(
      RedisKeyCategories.FIND_ALL_CATEG,
    );

    // eslint-disable-next-line prettier/prettier
    if (usersCached.length > 0 && usersCached[0].store_id === store.stores[0].id) {
      return usersCached;
    }

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
        store_id: store.stores[0].id,
      },
    });
    await this.cacheManger.set(
      RedisKeyCategories.FIND_ALL_CATEG,
      categories,
      ttl,
    );
    return [...categories];
  }

  // eslint-disable-next-line prettier/prettier
  async update(slug: string, id: number, updateCategoryDto: UpdateCategoryDto, user: User) {
    const { description, name } = updateCategoryDto;

    const existStore = await this.storeService.findOneStoreBySlugAndUSerId(
      slug.toLocaleLowerCase(),
      user,
    );

    if (existStore instanceof NotFoundException) {
      return existStore; // Retorna la ecepcion
    }

    const store: Store = existStore['stores'];

    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id,
          store_id: store.id,
        },
      });

      if (!category) {
        return new BadRequestException('Category not found');
      }

      const newDescription = description ? description : category.description;

      const newName = name ? name : category.name;

      const newCategory = {
        ...category,
        name: newName.toLocaleLowerCase(),
        slug: name.toLowerCase().replaceAll(' ', '_').replaceAll("'", ''),
        description: newDescription.toLocaleLowerCase(),
        updated_at: new Date(),
      };

      const categorySaved = await this.categoryRepository.save(newCategory);
      return categorySaved;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }

  async remove(slug: string, id: number, user: User) {
    const existStore = await this.storeService.findOneStoreBySlugAndUSerId(
      slug.toLocaleLowerCase(),
      user,
    );

    if (existStore instanceof NotFoundException) {
      return existStore; // Retorna la ecepcion
    }

    const store: Store = existStore['stores'];

    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id,
          store_id: store.id,
        },
      });

      if (!category) {
        return new BadRequestException('Category not found');
      }

      category.isActive = false;

      await this.categoryRepository.save(category);
      return `Category with ID ${id} deleted`;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }
}
