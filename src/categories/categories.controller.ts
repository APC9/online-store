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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/pagination.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { Auth } from '@src/auth/decorators/auth.decorator';
import { Roles } from '@src/interfaces';
import { User } from '@src/auth/entities/user.entity';
import { GetUser } from '@src/auth/decorators/get-user.decorator';

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
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  createCategoryByStore(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoriesService.create(createCategoryDto, user);
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
  @ApiOperation({ summary: 'Find all categories' })
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
  @ApiOperation({ summary: 'Find one category by Id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Get('by-term/:term')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of Categories',
    type: [Category],
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({ summary: 'Find one category by Name' })
  findByTerm(@Param('term') term: string) {
    return this.categoriesService.findByTerm(term);
  }

  @Get('url_slug/:term')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of categories of a store per slug',
    type: [Category],
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({ summary: 'Find one category by url_slug' })
  getAllCategoriesByStoreSlug(
    @Query() paginationDto: PaginationDto,
    @Param('term') term: string,
  ) {
    return this.categoriesService.getAllCategoriesByStoreSlug(
      paginationDto,
      term,
    );
  }

  @Patch('url_slug/:term/categori_id/:id')
  @ApiResponse({
    status: 200,
    description: 'Returns the updated Category',
    type: Category,
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({
    summary: 'Update one category by url_slug Store and Category ID',
  })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  updateCategoryByStore(
    @Param('term') term: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoriesService.update(term, id, updateCategoryDto, user);
  }

  @Delete('url_slug/:term/categori_id/:id')
  @ApiResponse({ status: 200, description: 'Category with ID deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({
    summary: 'Delete one category by url_slug Store and Category ID',
  })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  deleteCategoryByStore(
    @Param('term') term: string,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.categoriesService.remove(term, id, user);
  }
}
