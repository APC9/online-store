import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { FileUploadController } from '@file-upload/file-upload.controller';
import { FileUploadService } from '@file-upload/file-upload.service';
import { FileUploadDto } from '@file-upload/dto/file-upload.dto';

import { Folder } from '@src/interfaces/store.interfaces';

jest.mock('@file-upload/file-upload.service');

describe('FileUploadController', () => {
  let fileUploadController: FileUploadController;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [FileUploadService],
    }).compile();

    fileUploadController = app.get<FileUploadController>(FileUploadController);
    fileUploadService = app.get<FileUploadService>(FileUploadService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(fileUploadController).toBeDefined();
  });

  describe('uploadFiles', () => {
    it('should return an array of strings', async () => {
      let urls: string[] = [];

      const fileUploadDto: FileUploadDto = {
        foldername: Folder.PRODUCTS,
        storename: 'MyStore',
      };

      const files: Express.Multer.File[] = [
        {
          fieldname: 'images',
          originalname: '20191207_191610.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: '/tmp',
          filename: '65087308b494ddd858a8c38d1768fcce',
          path: '/tmp/65087308b494ddd858a8c38d1768fcce',
          size: 2111556,
        } as Express.Multer.File,
      ];

      urls = await fileUploadController.uploadFiles(files, fileUploadDto);

      expect(fileUploadService.fileUploadStore).toHaveBeenCalled();
      expect(urls.every((url) => typeof url === 'string')).toBe(true);
    });

    it('should return BadRequestException', async () => {
      const fileUploadDto: FileUploadDto = {
        foldername: Folder.PRODUCTS,
        storename: 'MyStore',
      };

      const files: Express.Multer.File[] = [];

      try {
        await fileUploadController.uploadFiles(files, fileUploadDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
