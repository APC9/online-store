import { Test, TestingModule } from '@nestjs/testing';

import { CategoryProductController } from '@category-product/category-product.controller';
import { CategoryProductService } from '@category-product/category-product.service';
import {
  CreateCategoryProductDto,
  UpdateCategoryProductDto,
} from '@category-product/dto';

import { PaginationDto } from '@common/pagination.dto';

import {
  allCategoriesProducts,
  categoryProductStub,
} from './stub/category-product.stub';

import { productStub } from '../products/stub/product.stub';

jest.mock('@category-product/category-product.service');

describe('CategoryProductController', () => {
  let categoryProductController: CategoryProductController;
  let categoryProductService: CategoryProductService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoryProductController],
      providers: [CategoryProductService],
    }).compile();

    // eslint-disable-next-line prettier/prettier
    categoryProductController = app.get<CategoryProductController>(CategoryProductController);

    // eslint-disable-next-line prettier/prettier
    categoryProductService = app.get<CategoryProductService>(CategoryProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(categoryProductController).toBeDefined();
  });

  describe('find All Products By Category Id', () => {
    let products;

    beforeEach(async () => {
      products = await categoryProductController.findAllProductsByCategoryId(
        expect.any(Number),
      );
    });

    it('Then it should call categoryProductService.findAllProductsByCategoryId', () => {
      expect(
        categoryProductService.findAllProductsByCategoryId,
      ).toHaveBeenCalled();
      expect(
        categoryProductService.findAllProductsByCategoryId,
      ).toHaveBeenCalledWith(expect.any(Number));
    });

    it('Should return Products[]', () => {
      expect(products).toEqual([productStub()]);
    });
  });

  describe('find All Products By Category Name', () => {
    let products;

    beforeEach(async () => {
      products = await categoryProductController.findAllProductsByCategoryName(
        expect.any(String),
      );
    });

    it('Then it should call categoryProductService.findAllProductsByCategoryName', () => {
      expect(
        categoryProductService.findAllProductsByCategoryName,
      ).toHaveBeenCalled();
      expect(
        categoryProductService.findAllProductsByCategoryName,
      ).toHaveBeenCalledWith(expect.any(String));
    });

    it('Should return Products[]', () => {
      expect(products).toEqual([productStub()]);
    });
  });

  describe('find All Categories With All Products', () => {
    let products;

    const paginationDto: PaginationDto = {
      limit: expect.any(Number),
      offset: expect.any(Number),
    };

    beforeEach(async () => {
      products =
        await categoryProductController.findAllCategoriesWithAllProducts(
          paginationDto,
        );
    });

    it('Then it should call categoryProductService.findAllCategoriesWithAllProducts', () => {
      expect(
        categoryProductService.findAllCategoriesWithAllProducts,
      ).toHaveBeenCalled();
      expect(
        categoryProductService.findAllCategoriesWithAllProducts,
      ).toHaveBeenCalledWith(paginationDto);
    });

    it('Should return All Products By Category Name', () => {
      expect(products).toEqual(allCategoriesProducts());
    });
  });

  describe('Assigned category to product', () => {
    let categoryProduct;

    const createCategoryProductDto: CreateCategoryProductDto = {
      categoryId: categoryProductStub().categoryId,
      productId: categoryProductStub().productId,
    };

    beforeEach(async () => {
      categoryProduct = await categoryProductController.assingCategoryToProduct(
        createCategoryProductDto,
      );
    });

    it('Then it should call categoryProductService.assingCategoryToProduct', () => {
      expect(categoryProductService.assingCategoryToProduct).toHaveBeenCalled();
      expect(
        categoryProductService.assingCategoryToProduct,
      ).toHaveBeenCalledWith(createCategoryProductDto);
    });

    it('It should show the relationship of the category and the product.', () => {
      expect(categoryProduct).toEqual(categoryProductStub());
    });
  });

  describe('Update Category ProductDto', () => {
    let categoryProduct;

    const updateCategoryProductDto: UpdateCategoryProductDto = {
      currentCategory: categoryProductStub().categoryId,
      newCategory: 2,
    };

    beforeEach(async () => {
      categoryProduct = await categoryProductController.updateProductCategory(
        categoryProductStub().id.toString(),
        updateCategoryProductDto,
      );
    });

    it('Then it should call categoryProductService.updateProductCategory', () => {
      expect(categoryProductService.updateProductCategory).toHaveBeenCalled();
      expect(categoryProductService.updateProductCategory).toHaveBeenCalledWith(
        categoryProductStub().id,
        updateCategoryProductDto,
      );
    });

    it('Then it should call categoryProductService.update and return String', () => {
      expect(categoryProduct).toEqual(expect.any(String));
    });
  });

  describe('Remove Product From Category', () => {
    let categoryProduct;

    const createCategoryProductDto: CreateCategoryProductDto = {
      categoryId: categoryProductStub().categoryId,
      productId: categoryProductStub().productId,
    };

    beforeEach(async () => {
      categoryProduct =
        await categoryProductController.removeProductFromCategory(
          createCategoryProductDto,
        );
    });

    it('Then it should call categoryProductService.updateProductCategory', () => {
      expect(
        categoryProductService.removeProductFromCategory,
      ).toHaveBeenCalled();
      expect(
        categoryProductService.removeProductFromCategory,
      ).toHaveBeenCalledWith(createCategoryProductDto);
    });

    it('Should return a string', () => {
      expect(categoryProduct).toEqual(expect.any(String));
    });
  });
});
