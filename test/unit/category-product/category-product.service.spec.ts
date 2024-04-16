import { Repository } from 'typeorm';

import {
  CreateCategoryProductDto,
  UpdateCategoryProductDto,
} from '@category-product/dto';

import { CategoryProductService } from '@category-product/category-product.service';
import { CategoryProduct } from '@category-product/entities/category-product.entity';

import { CategoriesService } from '@categories/categories.service';
import { ProductsService } from '@products/products.service';
import {
  allCategoriesProducts,
  categoryProductStub,
} from './stub/category-product.stub';

import { PaginationDto } from '@common/pagination.dto';
import { productStub } from '../products/stub/product.stub';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

jest.mock('@categories/categories.service');
jest.mock('@products/products.service');

// #region TESTING
describe('CategoryProductService', () => {
  let categoryProductService: CategoryProductService;
  let categoryProductRepository: Repository<CategoryProduct>;

  const mockCategoryProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        CategoryProductService,
        CategoriesService,
        ProductsService,
        {
          provide: getRepositoryToken(CategoryProduct),
          useValue: mockCategoryProductRepository,
        },
      ],
    }).compile();

    categoryProductService = app.get<CategoryProductService>(
      CategoryProductService,
    );
    categoryProductRepository = app.get<Repository<CategoryProduct>>(
      getRepositoryToken(CategoryProduct),
    );
  });

  describe('CategoryProductService', () => {
    describe('Assigned category to product', () => {
      it('It should show the relationship of the category and the product.', async () => {
        const createCategoryProductDto: CreateCategoryProductDto = {
          categoryId: categoryProductStub().categoryId,
          productId: categoryProductStub().productId,
        };

        jest.spyOn(categoryProductRepository, 'find').mockResolvedValue([]);

        jest
          .spyOn(categoryProductRepository, 'create')
          .mockReturnValueOnce(categoryProductStub());

        jest
          .spyOn(categoryProductRepository, 'save')
          .mockResolvedValueOnce(categoryProductStub());

        const response = await categoryProductService.assingCategoryToProduct(
          createCategoryProductDto,
        );

        expect(response).toEqual(categoryProductStub());
      });

      it('should return BadRequestException', async () => {
        const createCategoryProductDto: CreateCategoryProductDto = {
          categoryId: categoryProductStub().categoryId,
          productId: categoryProductStub().productId,
        };

        jest
          .spyOn(categoryProductRepository, 'find')
          .mockResolvedValue([categoryProductStub()]);

        jest
          .spyOn(categoryProductRepository, 'create')
          .mockReturnValueOnce(categoryProductStub());

        jest
          .spyOn(categoryProductRepository, 'save')
          .mockResolvedValueOnce(categoryProductStub());

        const response = await categoryProductService.assingCategoryToProduct(
          createCategoryProductDto,
        );

        expect(response).toBeInstanceOf(BadRequestException);
      });
    });

    describe('update Product Category', () => {
      it('It should return a string and update the product category and relationship', async () => {
        const updateCategoryProductDto: UpdateCategoryProductDto = {
          currentCategory: categoryProductStub().categoryId,
          newCategory: 2,
        };

        jest.spyOn(categoryProductRepository, 'find').mockResolvedValue([]);

        jest.spyOn(categoryProductRepository, 'update');

        const response = await categoryProductService.updateProductCategory(
          categoryProductStub().categoryId,
          updateCategoryProductDto,
        );

        expect(response).toEqual(expect.any(String));
      });

      it('should return BadRequestException', async () => {
        const updateCategoryProductDto: UpdateCategoryProductDto = {
          currentCategory: categoryProductStub().categoryId,
          newCategory: 2,
        };

        jest
          .spyOn(categoryProductRepository, 'find')
          .mockResolvedValue([categoryProductStub()]);

        jest.spyOn(categoryProductRepository, 'update');

        const response = await categoryProductService.updateProductCategory(
          categoryProductStub().categoryId,
          updateCategoryProductDto,
        );

        expect(response).toBeInstanceOf(BadRequestException);
      });
    });

    describe('remove Product From Category', () => {
      it('It should return a string and delete the product category and relationship', async () => {
        const createCategoryProductDto: CreateCategoryProductDto = {
          categoryId: categoryProductStub().categoryId,
          productId: categoryProductStub().productId,
        };

        jest
          .spyOn(categoryProductRepository, 'find')
          .mockResolvedValue([categoryProductStub()]);

        jest
          .spyOn(categoryProductRepository, 'createQueryBuilder')
          .mockReturnValueOnce({
            delete: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            execute: jest.fn().mockReturnThis(),
          } as any);

        const queryRemoveSpy = jest.spyOn(
          categoryProductService as any,
          'queyRemoveProductFromCategory',
        );

        const response = await categoryProductService.removeProductFromCategory(
          createCategoryProductDto,
        );

        expect(response).toEqual(expect.any(String));
        expect(queryRemoveSpy).toHaveBeenCalled();
      });

      it('should return BadRequestException', async () => {
        const createCategoryProductDto: CreateCategoryProductDto = {
          categoryId: categoryProductStub().categoryId,
          productId: categoryProductStub().productId,
        };

        jest.spyOn(categoryProductRepository, 'find').mockResolvedValue([]);

        jest.spyOn(categoryProductRepository, 'createQueryBuilder');

        const response = await categoryProductService.removeProductFromCategory(
          createCategoryProductDto,
        );

        expect(response).toBeInstanceOf(BadRequestException);
      });
    });

    describe('find All Categories With All Products', () => {
      it('It should return All Categories With All Products', async () => {
        const paginationDto: PaginationDto = {
          limit: expect.any(Number),
          offset: expect.any(Number),
        };

        jest
          .spyOn(categoryProductRepository, 'createQueryBuilder')
          .mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(allCategoriesProducts()),
          } as any);

        const queryRemoveSpy = jest.spyOn(
          categoryProductService as any,
          'queryFindAllCategoriesWithAllProducts',
        );

        const response =
          await categoryProductService.findAllCategoriesWithAllProducts(
            paginationDto,
          );

        expect(response).toEqual(allCategoriesProducts());
        expect(queryRemoveSpy).toHaveBeenCalled();
      });
    });

    describe('find All Products By Category Id', () => {
      it('It should return All Products By Category Id', async () => {
        jest
          .spyOn(categoryProductRepository, 'createQueryBuilder')
          .mockReturnValueOnce({
            distinct: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([productStub()]),
          } as any);

        const queryRemoveSpy = jest.spyOn(
          categoryProductService as any,
          'queryFindAllProductsByCategoryId',
        );

        const response =
          await categoryProductService.findAllProductsByCategoryId(
            expect.any(Number),
          );

        expect(response).toEqual([productStub()]);
        expect(queryRemoveSpy).toHaveBeenCalled();
      });
    });

    describe('fin dAll Products By Category Name', () => {
      it('It should return All Products By Category Name', async () => {
        jest
          .spyOn(categoryProductRepository, 'createQueryBuilder')
          .mockReturnValueOnce({
            distinct: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([productStub()]),
          } as any);

        const queryRemoveSpy = jest.spyOn(
          categoryProductService as any,
          'queryFindAllProductsByCategoryName',
        );

        const response =
          await categoryProductService.findAllProductsByCategoryName(
            expect.any(Number),
          );

        expect(response).toEqual([productStub()]);
        expect(queryRemoveSpy).toHaveBeenCalled();
      });
    });
  });
});
