/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/pagination.dto';
import { Product } from './entities/product.entity';
import { Auth } from '@src/auth/decorators/auth.decorator';
import { Roles } from '@src/interfaces';
import { GetUser } from '@src/auth/decorators/get-user.decorator';
import { User } from '@src/auth/entities/user.entity';

@ApiExtraModels(PaginationDto)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Returns the created product',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  @ApiOperation({ summary: 'Get All Products' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('url_slug/:term')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  @ApiOperation({ summary: 'Get all Products from a Store, by store url_slug' })
  findAllByStore(
    @Query() paginationDto: PaginationDto,
    @Param('term') term: string,
  ) {
    return this.productsService.findAllByStore(paginationDto, term);
  }

  @Get('by-id/:id')
  @ApiResponse({ status: 200, description: 'Returns a product', type: Product })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'Get a Product by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('by-term/:term')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({ summary: 'Get a Product by Term' })
  findByTerm(@Param('term') term: string) {
    return this.productsService.findByTerm(term);
  }

  @Patch(':id/url_slug/:term')
  @ApiResponse({
    status: 200,
    description: 'Returns the updated product',
    type: Product,
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product by product ID and Store url_slug' })
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('term') term: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user, term);
  }

  @Delete(':id/url_slug/:term')
  @ApiResponse({ status: 200, description: 'Product with ID deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product by product ID and Store url_slug' })
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('term') term: string,
    @GetUser() user: User,
  ) {
    return this.productsService.remove(id, user, term);
  }
}
