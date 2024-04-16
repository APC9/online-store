import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';

import { ApiBody, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { PaginationDto } from '@common/pagination.dto';
import { Product } from '@products/entities/product.entity';

import { CreateCategoryProductDto, UpdateCategoryProductDto } from './dto';
import { CategoryProductService } from './category-product.service';


@ApiTags('category-product')
@Controller('category-product')
export class CategoryProductController {
  constructor(
    private readonly categoryProductService: CategoryProductService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Returns created',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  assingCategoryToProduct(
    @Body() createCategoryProductDto: CreateCategoryProductDto,
  ) {
    return this.categoryProductService.assingCategoryToProduct(
      createCategoryProductDto,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return the categories with their products',
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  findAllCategoriesWithAllProducts(@Query() paginationDto: PaginationDto) {
    return this.categoryProductService.findAllCategoriesWithAllProducts(
      paginationDto,
    );
  }

  @Get('category-name/:categoryName')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  findAllProductsByCategoryName(@Param('categoryName') categoryName: string) {
    return this.categoryProductService.findAllProductsByCategoryName(
      categoryName,
    );
  }

  @Get('category-id/:categoryId')
  @Get('category-name/:categoryName')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
  })
  findAllProductsByCategoryId(@Param('categoryId') categoryId: string) {
    return this.categoryProductService.findAllProductsByCategoryId(+categoryId);
  }

  @Patch('update-product/:productId')
  @ApiResponse({
    status: 201,
    description: 'Product category with Id successfully updated',
  })
  @ApiBody({ type: UpdateCategoryProductDto })
  updateProductCategory(
    @Param('productId') productId: string,
    @Body() updateCategoryProductDto: UpdateCategoryProductDto,
  ) {
    return this.categoryProductService.updateProductCategory(
      +productId,
      updateCategoryProductDto,
    );
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: `product: "PRODUCT" removed from category: "CATEGORY"`,
  })
  @ApiResponse({
    status: 404,
    description:
      'There is No product with id "product.id" assigned to that category',
  })
  @ApiBody({ type: CreateCategoryProductDto })
  removeProductFromCategory(
    @Body() createCategoryProductDto: CreateCategoryProductDto,
  ) {
    return this.categoryProductService.removeProductFromCategory(
      createCategoryProductDto,
    );
  }
}
