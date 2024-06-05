import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginationDto } from '@common/pagination.dto';
import { Product } from '@products/entities/product.entity';

import { CreateCategoryProductDto, UpdateCategoryProductDto } from './dto';
import { CategoryProductService } from './category-product.service';
import { Auth } from '@src/auth/decorators/auth.decorator';
import { Roles } from '@src/interfaces';
import { GetUser } from '@src/auth/decorators/get-user.decorator';
import { User } from '@src/auth/entities/user.entity';

@ApiTags('category-product')
@Controller('category-product')
export class CategoryProductController {
  constructor(
    private readonly categoryProductService: CategoryProductService,
  ) {}

  @Post('url_slug/:term')
  @ApiResponse({
    status: 201,
    description: 'Returns created',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({
    summary: 'Assign a product to a category By store url_slug',
  })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  assingCategoryToProduct(
    @Body() createCategoryProductDto: CreateCategoryProductDto,
    @Param('term') term: string,
    @GetUser() user: User,
  ) {
    return this.categoryProductService.assingCategoryToProduct(
      createCategoryProductDto,
      user,
      term,
    );
  }

  @Get('url_slug/:term')
  @ApiResponse({
    status: 200,
    description: 'Return the categories with their products',
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  @ApiOperation({
    summary: 'Find all categories by store url_slug',
  })
  findAllCategoriesWithAllProducts(
    @Query() paginationDto: PaginationDto,
    @Param('term') term: string,
  ) {
    return this.categoryProductService.findAllCategoriesWithAllProducts(
      paginationDto,
      term,
    );
  }

  @Get('category-name/:categoryName')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({
    summary: 'Find all Categories By Category Name',
  })
  findAllProductsByCategoryName(@Param('categoryName') categoryName: string) {
    return this.categoryProductService.findAllProductsByCategoryName(
      categoryName,
    );
  }

  @Get('category-id/:categoryId')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
  })
  @ApiOperation({
    summary: 'Find all Products By Category ID',
  })
  findAllProductsByCategoryId(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryProductService.findAllProductsByCategoryId(categoryId);
  }

  @Patch('update-product/:productId')
  @ApiResponse({
    status: 201,
    description: 'Product category with Id successfully updated',
  })
  @ApiOperation({
    summary: 'Update the category of a product by the product Id',
  })
  @ApiBody({ type: UpdateCategoryProductDto })
  updateProductCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateCategoryProductDto: UpdateCategoryProductDto,
  ) {
    return this.categoryProductService.updateProductCategory(
      productId,
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
  @ApiOperation({
    summary: 'Delete the category of a product by the product id',
  })
  removeProductFromCategory(
    @Body() createCategoryProductDto: CreateCategoryProductDto,
  ) {
    return this.categoryProductService.removeProductFromCategory(
      createCategoryProductDto,
    );
  }
}
