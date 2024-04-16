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
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @Post()
  @UseInterceptors(
    FilesFastifyInterceptor('images', 5, {
      storage: diskStorage({}),
      fileFilter: imageFileFilter,
    }),
  )
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
