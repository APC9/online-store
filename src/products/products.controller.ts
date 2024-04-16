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
} from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/pagination.dto';
import { Product } from './entities/product.entity';

@ApiExtraModels(PaginationDto)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Returns the created product', type: Product })
  @ApiResponse({status: 400, description: 'Bad  Request'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiResponse({
    status: 200, 
    description: 'Returns a list of products', 
    type: [Product], 
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationDto) },
      ],
    }
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('by-id/:id')
  @ApiResponse({status: 200, description: 'Returns a product', type: Product })
  @ApiResponse({status: 400, description: 'Bad  Request'})
  @ApiResponse({status: 404, description: 'Not Found'})
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('by-term/:term')
  @ApiResponse({status: 200, description: 'Returns a list of products', type: [Product] })
  @ApiResponse({status: 400, description: 'Bad  Request'})
  findByTerm(@Param('term') term: string) {
    return this.productsService.findByTerm(term);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200, 
    description: 'Returns the updated product', 
    type: Product, 
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationDto) },
      ],
    }
  })
  @ApiBody({type: CreateProductDto})
  @ApiResponse({status: 400, description: 'Bad  Request'})
  @ApiResponse({status: 404, description: 'Not Found'})
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiResponse({status: 200, description: 'Product with ID deleted' })
  @ApiResponse({status: 404, description: 'Not Found'})
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
