import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from '@categories/categories.controller';
import { CategoriesService } from '@categories/categories.service';
import { PaginationDto } from '@common/pagination.dto';
import { Category } from '@categories/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/categories/dto';

import { categoryStub, stringCategoryStub } from './stub/category.stub';

jest.mock('@categories/categories.service');

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    categoriesController = app.get<CategoriesController>(CategoriesController);
    categoriesService = app.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('findByTerm categories.', () => {
    let categories: Category[];

    beforeEach(async () => {
      categories = await categoriesController.findByTerm(expect.any(String));
    });

    it('Then it should call categoriesService.findByTerm', () => {
      expect(categoriesService.findByTerm).toHaveBeenCalled();
      expect(categoriesService.findByTerm).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('Then it should call categoriesService.findByTerm and return categories[]', () => {
      expect(categories).toEqual([categoryStub()]);
    });
  });

  describe('findOne category', () => {
    let category: Category;

    beforeEach(async () => {
      category = await categoriesController.findOne(expect.any(Number));
    });

    it('Then it should call categoriesService.findOne', () => {
      expect(categoriesService.findOne).toHaveBeenCalled();
      expect(categoriesService.findOne).toHaveBeenCalledWith(
        expect.any(Number),
      );
    });

    it('Then it should call categoriesService.findOne and return a category', () => {
      expect(category).toEqual(categoryStub());
    });
  });

  describe('findAll categories', () => {
    let categories: Category[];

    const paginationDto: PaginationDto = {
      limit: expect.any(Number),
      offset: expect.any(Number),
    };

    beforeEach(async () => {
      categories = await categoriesController.findAll(paginationDto);
    });

    it('Then it should call categoriesService.findAll', () => {
      expect(categoriesService.findAll).toHaveBeenCalled();
      expect(categoriesService.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it('Then it should call categoriesService.findAll and return a products[]', () => {
      expect(categories).toEqual([categoryStub()]);
    });
  });

  describe('create category', () => {
    let category: Category;

    const createCategoryDto: CreateCategoryDto = {
      name: categoryStub().name,
      description: categoryStub().description,
      isActive: categoryStub().isActive,
      store_id: categoryStub().store_id,
    };

    beforeEach(async () => {
      category = await categoriesController.create(createCategoryDto);
    });

    it('Then it should call categoriesService.create', () => {
      expect(categoriesService.create).toHaveBeenCalled();
      expect(categoriesService.create).toHaveBeenCalledWith(createCategoryDto);
    });

    it('Then it should call categoriesService.create and return a category', () => {
      expect(category).toEqual(categoryStub());
    });
  });

  describe('update category', () => {
    let category: Category;

    const updateCategoryDto: UpdateCategoryDto = {
      name: categoryStub().name,
      description: categoryStub().description,
    };

    beforeEach(async () => {
      category = await categoriesController.update(
        categoryStub().id.toString(),
        updateCategoryDto,
      );
    });

    it('Then it should call categoriesService.update', () => {
      expect(categoriesService.update).toHaveBeenCalled();
      expect(categoriesService.update).toHaveBeenCalledWith(
        categoryStub().id,
        updateCategoryDto,
      );
    });

    it('Then it should call categoriesService.update and return a product', () => {
      expect(category).toEqual(categoryStub());
    });
  });

  describe('Delete category', () => {
    let response: string;

    beforeEach(async () => {
      response = await categoriesController.remove(expect.any(Number));
    });

    it('Then it should call productsService.remove and removed a product', () => {
      expect(response).toEqual(stringCategoryStub());
    });
  });
});
