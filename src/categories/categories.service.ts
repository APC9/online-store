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

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto, RedisKeyCategories } from '../common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManger: Cache) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description, ...rest } = createCategoryDto;
    const newDescription = description ? description.toLocaleLowerCase() : '';

    try {
      const category = this.categoryRepository.create({
        ...rest,
        name: name.toLocaleLowerCase(),
        description: newDescription,
      });
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const ttl = 5 * 60 * 1000; // Time to live

    const usersCached: Category[] = await this.cacheManger.get(
      RedisKeyCategories.FIND_ALL,
    );

    if (usersCached) return usersCached;

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
      },
    });

    await this.cacheManger.set(RedisKeyCategories.FIND_ALL, categories, ttl);
    return [...categories];
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException(`Category ID must be a number`);
    }
    const category = await this.categoryRepository.findOneBy({
      id: +id,
      isActive: true,
    });
    if (!category) throw new NotFoundException(`Category with ${id} not found`);
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { description, name } = updateCategoryDto;

    const newDescription = description
      ? description.toLocaleLowerCase()
      : category.description;

    const newName = name ? name.toLocaleLowerCase() : category.name;

    const newCategory: Category = {
      ...category,
      name: newName,
      description: newDescription,
      updated_at: new Date(),
    };

    try {
      const categorySaved = await this.categoryRepository.save(newCategory);
      return categorySaved;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    category.isActive = false;
    await this.categoryRepository.save(category);
    return `Category with ID ${id} deleted`;
  }
}
