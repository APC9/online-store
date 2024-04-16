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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/pagination.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiExtraModels(PaginationDto)
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Returns the created Category',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of Categories',
    type: [Category],
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get('by-id/:id')
  @ApiResponse({
    status: 200,
    description: 'Returns a Category',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Get('by-term/:term')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of Categories',
    type: [Category],
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  findByTerm(@Param('term') term: string) {
    return this.categoriesService.findByTerm(term);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns the updated Category',
    type: Category,
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Category with ID deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
