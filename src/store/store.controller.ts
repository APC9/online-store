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

import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Auth } from '@src/auth/decorators/auth.decorator';
import { Roles } from '@src/interfaces';
import { GetUser } from '@src/auth/decorators/get-user.decorator';
import { User } from '@src/auth/entities/user.entity';
import { PaginationDto } from '@src/common';
import { Store } from './entities/store.entity';

@ApiExtraModels(PaginationDto)
@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Returns the created store',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiOperation({ summary: 'Create a new Store' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  createStore(@Body() createStoreDto: CreateStoreDto, @GetUser() user: User) {
    return this.storeService.create(createStoreDto, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of Stores[]',
    type: [Store],
    schema: {
      allOf: [{ $ref: getSchemaPath(PaginationDto) }],
    },
  })
  @ApiOperation({ summary: 'Find all Stores' })
  findAllStores(@Query() paginationDto: PaginationDto) {
    return this.storeService.findAll(paginationDto);
  }

  @Get('by_name/:term')
  @ApiResponse({
    status: 200,
    description: 'find One By name Store - Returns a Store[]',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'find One Store By Name Store' })
  findOneByNameStore(@Param('term') term: string) {
    return this.storeService.findOneByNameStore(term);
  }

  @Get('url_slug/:term')
  @ApiResponse({
    status: 200,
    description: 'Find One By Url Slug Store - Returns a Store[]',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'find One Store By slug_url Store' })
  findOneBySlugStore(@Param('term') term: string) {
    return this.storeService.findOneBySlugStore(term);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Find One By ID Store - Returns a Store',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'find One Store By ID Store' })
  findOneByIdStore(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.findOneByIdStore(id);
  }

  @Get('user_id')
  @ApiResponse({
    status: 200,
    description: 'Find One By User Id Store - Returns a Store[]',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'find All Stores By User Id' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  findStoresByUSerId(@GetUser() user: User) {
    return this.storeService.findStoresByUSerId(user);
  }

  @Get('store_id/:id')
  @ApiResponse({
    status: 200,
    description: 'Find One Store By Id And User Id - Returns a Store',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  @ApiOperation({ summary: 'find One Store By Store ID and User ID' })
  findOneStoreByIdAndUSerId(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.storeService.findOneStoreByIdAndUSerId(id, user);
  }

  @Get('slug/:term')
  @ApiResponse({
    status: 200,
    description: 'Find One By Store Id Store - Returns a Stores',
    type: Store,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'find One Store By slug_url Store and User ID' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  findOneStoreBySlugAndUSerId(
    @Param('term') term: string,
    @GetUser() user: User,
  ) {
    return this.storeService.findOneStoreBySlugAndUSerId(term, user);
  }

  @Patch(':term')
  @ApiResponse({
    status: 200,
    description: 'Returns the updated store',
    type: Store,
  })
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'update Store By url_slug Store' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  updateStore(
    @Param('term') term: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @GetUser() user: User,
  ) {
    return this.storeService.update(term, updateStoreDto, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'store with ID deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'delete One Store By store ID' })
  @ApiBearerAuth()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  deleteStore(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.storeService.remove(id, user);
  }
}
