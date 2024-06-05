import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { FileUploadService } from './file-upload.service';
import { diskStorage, FilesFastifyInterceptor } from 'fastify-file-interceptor';
import { imageFileFilter } from './util/file-upload.util';
import { FileUploadDto } from './dto/file-upload.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '@src/auth/decorators/auth.decorator';
import { Roles } from '@src/interfaces';

@ApiTags('Upload File')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiResponse({
    status: 201,
    description: 'Returns a list of urls "string[]" ',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          maxItems: 5,
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
    description: 'List of images to upload, maximum of files 5',
  })
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FilesFastifyInterceptor('images', 5, {
      storage: diskStorage({}),
      fileFilter: imageFileFilter,
    }),
  )
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  @ApiOperation({ summary: 'Upload Files' })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query() fileUploadDto: FileUploadDto,
  ) {
    if (files.length === 0)
      throw new BadRequestException('Make sure you have selected any images');

    return this.fileUploadService.fileUploadStore({
      files,
      fileUploadDto,
    });
  }
}
