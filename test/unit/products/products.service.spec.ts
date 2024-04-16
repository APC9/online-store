import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import { Repository } from 'typeorm';

import { ProductsService } from '@products/products.service';
import { Product } from '@products/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '@products/dto';

import { PaginationDto } from '@common/pagination.dto';
import { RedisKeyProducts } from '@common/constants';

import { productStub } from './stub/product.stub';

describe('ProductService', () => {
  let productsService: ProductsService;
  let productRepository: Repository<Product>;
  let cache: Cache;

  const mockProductRepository = {
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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
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

    productsService = app.get<ProductsService>(ProductsService);
    productRepository = app.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    cache = app.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll products', () => {
    it('should return an array of products', async () => {
      const paginationDto: PaginationDto = {
        limit: 10,
        offset: 0,
      };

      jest.spyOn(productRepository, 'find').mockResolvedValue([productStub()]);

      // Simula que no hay productos en caché
      const spyCache = jest.spyOn(cache, 'get').mockResolvedValueOnce(null);

      const products = await productsService.findAll(paginationDto);

      expect(products).toEqual([productStub()]);
      expect(productRepository.find).toHaveBeenCalled();

      // Verifica que se llamó a la función get del caché
      expect(spyCache).toHaveBeenCalled();
      expect(spyCache.mock.calls[0][0]).toEqual(RedisKeyProducts.FIND_ALL);

      expect(productRepository.find).toHaveBeenCalledWith({
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
        .mockResolvedValueOnce([productStub()]);

      await productsService.findAll(paginationDto);

      expect(productRepository.find).not.toHaveBeenCalled();
      expect(spyCache.mock.calls[0][0]).toEqual(RedisKeyProducts.FIND_ALL);
      expect(jest.spyOn(cache, 'set')).not.toHaveBeenCalled();
    });
  });

  describe('findOne product', () => {
    it('should return an product', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(productStub());

      const products = await productsService.findOne(3);

      expect(products).toEqual(productStub());
      expect(productRepository.findOneBy).toHaveBeenCalled();
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: 3,
        isActive: true,
      });
    });

    it('should throw a NotFoundException if the product is not found', async () => {
      const product = null;
      const productID = 1000000;

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValueOnce(product);

      await expect(productsService.findOne(productID)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw a BadRequestException if the product ID is not a number', async () => {
      const invalidId = 'abc';

      await expect(
        productsService.findOne(parseInt(invalidId)),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByTerm products', () => {
    it('should return one or more products', async () => {
      const term = 'product';

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([productStub()]),
      } as any);

      const products = await productsService.findByTerm(term);

      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
      expect(products).toEqual([productStub()]);
    });

    it('should throw a NotFoundException if the product is not found', async () => {
      const invalidTerm = 'Product not found';

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as any);

      await expect(productsService.findByTerm(invalidTerm)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create product', () => {
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
    it('I should create a new product and return it', async () => {
      jest
        .spyOn(productRepository, 'create')
        .mockReturnValueOnce(productStub());

      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValueOnce(productStub());

      const product = await productsService.create(createProductDto);

      expect(product).toEqual(productStub());
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith({
        ...createProductDto,
        id: 4,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    /*     it('should return BadRequestException', async () => {
      const mockError = new BadRequestException('Mock Error');

      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw mockError;
      });

      try {
        await productsService.create(createProductDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    }); */
  });

  describe('update product', () => {
    const updateProductDto: UpdateProductDto = {
      ...productStub(),
      name: 'Producto Actualizado',
    };
    it('I should update a product and return it', async () => {
      jest.spyOn(productRepository, 'save').mockResolvedValueOnce({
        ...productStub(),
        name: 'Producto Actualizado',
      });

      const product = await productsService.update(
        productStub().id,
        updateProductDto,
      );

      expect(product.name).toContain(updateProductDto.name);
      expect(productRepository.save).toHaveBeenCalled();
    });
  });

  describe('Delete product', () => {
    const output = `Product with ID ${productStub().id} deleted`;

    it('I should update a product product.isActive = false', async () => {
      jest.spyOn(productRepository, 'save').mockResolvedValueOnce({
        ...productStub(),
        isActive: false,
      });

      const resp = await productsService.remove(productStub().id);

      expect(resp).toContain(output);
      expect(productRepository.save).toHaveBeenCalled();
    });
  });
});
