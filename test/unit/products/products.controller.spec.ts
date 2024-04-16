import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from '@products/products.controller';
import { ProductsService } from '@products/products.service';
import { Product } from '@products/entities/product.entity';

import { CreateProductDto, UpdateProductDto } from '@products/dto';
import { PaginationDto } from '@common/pagination.dto';

import { productStub, stringProductStub } from './stub/product.stub';

jest.mock('@products/products.service');

//paso 5 los test del controllador
describe('ProductController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    productsController = app.get<ProductsController>(ProductsController);
    productsService = app.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('findByTerm product.', () => {
    let products: Product[];

    beforeEach(async () => {
      products = await productsController.findByTerm(expect.any(String));
    });

    it('Then it should call productsService.findByTerm', () => {
      expect(productsService.findByTerm).toHaveBeenCalled();
      expect(productsService.findByTerm).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('Then it should call productsService.findByTerm and return a product', () => {
      expect(products).toEqual([productStub()]);
    });
  });

  describe('findOne product', () => {
    let product: Product;

    beforeEach(async () => {
      product = await productsController.findOne(expect.any(Number));
    });

    it('Then it should call productsService.findOne', () => {
      expect(productsService.findOne).toHaveBeenCalled();
      expect(productsService.findOne).toHaveBeenCalledWith(expect.any(Number));
    });

    it('Then it should call productsService.findOne and return a product', () => {
      expect(product).toEqual(productStub());
    });
  });

  describe('findAll products', () => {
    let products: Product[];

    const paginationDto: PaginationDto = {
      limit: expect.any(Number),
      offset: expect.any(Number),
    };

    beforeEach(async () => {
      products = await productsController.findAll(paginationDto);
    });

    it('Then it should call productsService.findAll', () => {
      expect(productsService.findAll).toHaveBeenCalled();
      expect(productsService.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it('Then it should call productsService.findAll and return a products[]', () => {
      expect(products).toEqual([productStub()]);
    });
  });

  describe('create product', () => {
    let product: Product;

    const createProductDto: CreateProductDto = {
      name: productStub().name,
      sku: productStub().sku,
      description: productStub().description,
      price: productStub().price,
      status: productStub().status,
      stock: productStub().stock,
      isActive: productStub().isActive,
      images_urls: productStub().images_urls,
    };

    beforeEach(async () => {
      product = await productsController.create(createProductDto);
    });

    it('Then it should call productsService.create', () => {
      expect(productsService.create).toHaveBeenCalled();
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
    });

    it('Then it should call productsService.create and return a product', () => {
      expect(product).toEqual(productStub());
    });
  });

  describe('update product', () => {
    let product: Product;

    const updateProductDto: UpdateProductDto = {
      name: productStub().name,
      sku: productStub().sku,
      description: productStub().description,
    };

    beforeEach(async () => {
      product = await productsController.update(
        productStub().id.toString(),
        updateProductDto,
      );
    });

    it('Then it should call productsService.update', () => {
      expect(productsService.update).toHaveBeenCalled();
      expect(productsService.update).toHaveBeenCalledWith(
        productStub().id,
        updateProductDto,
      );
    });

    it('Then it should call productsService.update and return a product', () => {
      expect(product).toEqual(productStub());
    });
  });

  describe('Delete product', () => {
    let response: string;

    beforeEach(async () => {
      response = await productsController.remove(expect.any(Number));
    });

    it('Then it should call productsService.remove and removed a product', () => {
      expect(response).toEqual(stringProductStub());
    });
  });
});
