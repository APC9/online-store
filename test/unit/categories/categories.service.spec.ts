import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

import { CategoriesService } from '@categories/categories.service';
import { Category } from '@categories/entities/category.entity';
import { categoryStub } from './stub/category.stub';
import { CreateCategoryDto, UpdateCategoryDto } from '@categories/dto';

import { PaginationDto, RedisKeyCategories } from '@common/.';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryRepository: Repository<Category>;
  let cache: Cache;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => jest.fn(),
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    categoriesService = app.get<CategoriesService>(CategoriesService);
    categoryRepository = app.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    cache = app.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll categories', () => {
    it('should return an array of categories', async () => {
      const paginationDto: PaginationDto = {
        limit: 10,
        offset: 0,
      };

      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValue([categoryStub()]);

      // Simula que no hay productos en caché
      const spyCache = jest.spyOn(cache, 'get').mockResolvedValueOnce(null);

      const categories = await categoriesService.findAll(paginationDto);

      // Verifica que se llamó a la función get del caché
      expect(spyCache).toHaveBeenCalled();
      expect(spyCache.mock.calls[0][0]).toEqual(RedisKeyCategories.FIND_ALL);

      expect(categories).toEqual([categoryStub()]);
      expect(categoryRepository.find).toHaveBeenCalled();

      expect(categoryRepository.find).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        where: { isActive: true },
      });
    });

    it('should get the value from cache', async () => {
      const paginationDto: PaginationDto = {
        limit: 10,
        offset: 0,
      };

      const spyCache = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce([categoryStub()]);

      await categoriesService.findAll(paginationDto);

      expect(categoryRepository.find).not.toHaveBeenCalled();
      expect(spyCache.mock.calls[0][0]).toEqual(RedisKeyCategories.FIND_ALL);
      expect(jest.spyOn(cache, 'set')).not.toHaveBeenCalled();
    });
  });

  describe('findOne category', () => {
    it('should return an category', async () => {
      jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(categoryStub());

      const category = await categoriesService.findOne(3);

      expect(category).toEqual(categoryStub());
      expect(categoryRepository.findOneBy).toHaveBeenCalled();
      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        id: 3,
        isActive: true,
      });
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const category = null;
      const categoryID = 1000000;

      jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValueOnce(category);

      await expect(categoriesService.findOne(categoryID)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw a BadRequestException if the category ID is not a number', async () => {
      const invalidId = 'abc';

      await expect(
        categoriesService.findOne(parseInt(invalidId)),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByTerm categories', () => {
    it('should return one or more categories', async () => {
      const term = 'category';

      jest.spyOn(categoryRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([categoryStub()]),
      } as any);

      const categories = await categoriesService.findByTerm(term);

      expect(categoryRepository.createQueryBuilder).toHaveBeenCalled();
      expect(categories).toEqual([categoryStub()]);
    });

    it('should throw a NotFoundException if the Category is not found', async () => {
      const invalidTerm = 'Category not found';

      jest.spyOn(categoryRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as any);

      await expect(categoriesService.findByTerm(invalidTerm)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create category', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: categoryStub().name,
      description: categoryStub().description,
      isActive: categoryStub().isActive,
      store_id: categoryStub().store_id,
    };
    it('I should create a new category and return it', async () => {
      jest
        .spyOn(categoryRepository, 'create')
        .mockReturnValueOnce(categoryStub());

      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValueOnce(categoryStub());

      const category = await categoriesService.create(createCategoryDto);

      expect(category).toEqual(categoryStub());
      expect(categoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(categoryRepository.save).toHaveBeenCalledWith({
        ...createCategoryDto,
        id: 3,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should catch and log an error when saving a category', async () => {
      const mockError = new BadRequestException('Mock Error');

      jest.spyOn(categoryRepository, 'save').mockImplementation(() => {
        throw mockError;
      });

      try {
        await categoriesService.create(createCategoryDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('update category', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      ...categoryStub(),
      name: 'Categoria Actualizada',
    };
    it('I should update a category and return it', async () => {
      jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce({
        ...categoryStub(),
        name: 'Categoria Actualizada',
      });

      const category = await categoriesService.update(
        categoryStub().id,
        updateCategoryDto,
      );

      expect(category.name).toContain(updateCategoryDto.name);
      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('Delete category', () => {
    const output = `Category with ID ${categoryStub().id} deleted`;

    it('I should update a category category.isActive = false', async () => {
      jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce({
        ...categoryStub(),
        isActive: false,
      });

      const resp = await categoriesService.remove(categoryStub().id);

      expect(resp).toContain(output);
      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });
});
