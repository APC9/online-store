import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryProductDto } from './dto/create-category-product.dto';
import { UpdateCategoryProductDto } from './dto/update-category-product.dto';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { CategoryProduct } from './entities/category-product.entity';

import { AllCategoriesProducts } from '../interfaces/categoryProducts.interface';
import { PaginationDto } from '../common/pagination.dto';

import { Product } from '@products/entities/product.entity';
import { StoreService } from '@src/store/store.service';
import { User } from '@src/auth/entities/user.entity';

@Injectable()
export class CategoryProductService {
  private readonly logger = new Logger('CategoryProductService');

  constructor(
    @InjectRepository(CategoryProduct)
    private readonly categoryProductRepository: Repository<CategoryProduct>,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly storeService: StoreService,
  ) {}

  async assingCategoryToProduct(
    createCategoryProductDto: CreateCategoryProductDto,
    user: User,
    slug: string,
  ) {
    const { categoryId, productId } = createCategoryProductDto;

    const existStore = await this.storeService.findOneStoreBySlugAndUSerId(
      slug.toLocaleLowerCase(),
      user,
    );

    if (existStore instanceof NotFoundException) {
      return existStore; // Retorna la ecepcion
    }

    const storeId = existStore.id;

    const category = await this.categoriesService.findOne(categoryId, storeId);
    if (!category.id) return category;

    const product = await this.productsService.findOne(productId);
    if (!product.id) return product;

    const isDuplicate = await this.categoryProductRepository.find({
      where: {
        categoryId: category.id,
        productId: product.id,
      },
    });

    if (isDuplicate.length > 0)
      return new BadRequestException(
        `There is already a product with id ${product.id} assigned to that category`,
      );

    try {
      const categoryProduct = this.categoryProductRepository.create({
        categoryId: category.id,
        productId: product.id,
      });

      // eslint-disable-next-line prettier/prettier
      const catProdSaved = await this.categoryProductRepository.save(categoryProduct);

      return catProdSaved;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllCategoriesWithAllProducts(
    paginationDto: PaginationDto,
    term: string,
  ) {
    const store = await this.storeService.findOneBySlugStore(term);

    if (store instanceof NotFoundException) {
      return store; // Retorna la ecepcion
    }

    // Resultados de Funcion con consulta TypeORM a la BBDD
    const storeId = store.stores[0].id;

    let result = await this.queryFindAllCategoriesWithAllProducts(
      paginationDto,
      storeId,
    );

    // Eliminacion de productos duplicados con el mismo ID
    result = result.map((item: AllCategoriesProducts) => ({
      category: item['category'],
      products: item.products.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id),
      ),
    }));

    return result;
  }

  async findAllProductsByCategoryId(categoryId: number) {
    const category = await this.categoriesService.findOne(categoryId);
    if (!category.id) return category;

    // Retorna Resultados de Funcion con consulta TypeORM a l la BBDD
    return await this.queryFindAllProductsByCategoryId(categoryId);
  }

  async findAllProductsByCategoryName(nameCategory: string) {
    const category = await this.categoriesService.findByTerm(nameCategory);
    if (category.length === 0) return category;

    return await this.queryFindAllProductsByCategoryName(nameCategory);
  }

  async updateProductCategory(
    updateProductId: number,
    updateCategoryProductDto: UpdateCategoryProductDto,
  ) {
    const { currentCategory, newCategory } = updateCategoryProductDto;

    if (!currentCategory && !newCategory)
      return new BadRequestException('Product ID and Category ID are required');

    if (currentCategory === newCategory)
      return new BadRequestException('currentCategory === newCategory');

    // Validar que exista la antigua categoria
    const categoryCurrent =
      await this.categoriesService.findOne(currentCategory);
    if (!categoryCurrent.id) return categoryCurrent;

    //Validar que exista la nueva categoria
    const categoryNew = await this.categoriesService.findOne(newCategory);
    if (!categoryNew.id) return categoryNew;

    // Validar que exista el producto
    const product = await this.productsService.findOne(updateProductId);
    if (!product.id) return product;

    //Validar que la nuevaCategoria y el producto no esten en la BBDD
    const isDuplicate = await this.categoryProductRepository.find({
      where: {
        categoryId: categoryNew.id,
        productId: product.id,
      },
    });

    if (isDuplicate.length > 0)
      return new BadRequestException(
        `There is already a product with id ${product.id} assigned to that category`,
      );

    try {
      await this.categoryProductRepository.update(
        {
          //where "categoryId" = categoryCurrent.id and "productId" = product.id;
          categoryId: categoryCurrent.id,
          productId: product.id,
        },
        { categoryId: categoryNew.id }, // update
      );

      return `Product category with Id ${updateProductId} successfully updated`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeProductFromCategory(
    createCategoryProductDto: CreateCategoryProductDto,
  ) {
    const { categoryId, productId } = createCategoryProductDto;

    const category = await this.categoriesService.findOne(categoryId);
    if (!category.id) return category;

    const product = await this.productsService.findOne(productId);
    if (!product.id) return product;

    const isDuplicate = await this.categoryProductRepository.find({
      where: {
        categoryId: category.id,
        productId: product.id,
      },
    });

    if (isDuplicate.length === 0)
      return new BadRequestException(
        `There is No product with id ${product.id} assigned to that category`,
      );

    this.queyRemoveProductFromCategory(createCategoryProductDto);

    return `product: "${product.name}" removed from category: "${category.name}"`;
  }

  private async queyRemoveProductFromCategory(
    createCategoryProductDto: CreateCategoryProductDto,
  ) {
    const { categoryId, productId } = createCategoryProductDto;

    const queryBuilder =
      this.categoryProductRepository.createQueryBuilder('catProd');

    await queryBuilder
      .delete()
      .where('"categoryId" = :categoryId', { categoryId })
      .andWhere('"productId" = :productId', { productId })
      .execute();
  }

  private async queryFindAllCategoriesWithAllProducts(
    paginationDto: PaginationDto,
    storeId: number,
  ) {
    const { limit = 10, offset = 0 } = paginationDto;

    const queryBuilder = this.categoryProductRepository.createQueryBuilder();
    const result = await queryBuilder
      .select(
        'json_build_object(' +
          "'id', b.id, " +
          "'name', b.name, " +
          "'description', b.description, " +
          "'created_at', b.created_at, " +
          "'updated_at', b.updated_at, " +
          "'isActive', b.isActive, " +
          "'store_id', b.store_id, " +
          "'slug', b.slug " +
          ')',
        'category',
      )
      .addSelect(
        "json_agg(json_build_object('id', c.id, 'name', c.name, 'description', c.description, 'isActive', c.isActive, 'stock', c.stock, 'price', c.price, 'sku', c.sku, 'status', c.status, 'images_urls', c.images_urls, 'created_at', c.created_at, 'updated_at', c.updated_at))",
        'products',
      )
      .from('categories_products', 'a')
      .innerJoin('categories', 'b', 'b.id = a.categoryId')
      .innerJoin('products', 'c', 'c.id = a.productId')
      .where('b.store_id = :storeId', { storeId })
      .groupBy('b.id')
      .addGroupBy('b.name')
      .limit(limit)
      .offset(offset)
      .getRawMany();

    return result;
  }

  private async queryFindAllProductsByCategoryId(
    categoryId: number,
  ): Promise<Product[]> {
    const queryBuilder = this.categoryProductRepository.createQueryBuilder();
    const result = await queryBuilder
      .distinct(true)
      .select('c.*')
      .from('categories_products', 'a')
      .innerJoin('Category', 'b', 'b.id = a.categoryId AND b.isActive = true')
      .innerJoin('Product', 'c', 'c.id = a.productId AND c.isActive = true')
      .where('a.categoryId = :categoryId', { categoryId })
      .getRawMany();

    return result;
  }

  private async queryFindAllProductsByCategoryName(
    categoryName: string,
  ): Promise<Product[]> {
    const queryBuilder = this.categoryProductRepository.createQueryBuilder();
    const result = await queryBuilder
      .distinct(true)
      .select('c.*')
      .from('categories_products', 'a')
      .innerJoin('categories', 'b', 'b.id = a.categoryId')
      .innerJoin('products', 'c', 'c.id = a.productId')
      .where('b.name LIKE :name', { name: `%${categoryName}%` })
      .andWhere('c.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result;
  }
}
