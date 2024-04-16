import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { FileUploadService } from '@file-upload/file-upload.service';
import { FileUploadDto } from '@file-upload/dto/file-upload.dto';
import { cloudinaryStub } from './stub/cloudinary.stub';
import { UpdaloadData, Folder } from '@src/interfaces/store.interfaces';

describe('FileUploadService', () => {
  let fileUploadService: FileUploadService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    fileUploadService = app.get<FileUploadService>(FileUploadService);
    configService = app.get<ConfigService>(ConfigService);
  });

  beforeEach(() => {
    // Mock the implementation of cloudinary.uploader.upload
    cloudinary.uploader.upload = jest.fn().mockResolvedValue(cloudinaryStub());
  });

  describe('Test fileUploadStore', () => {
    it('should return BadRequestException if files are empty', async () => {
      const fileUploadDto: FileUploadDto = {
        foldername: Folder.PRODUCTS,
        storename: 'MyStore',
      };
      const files: Express.Multer.File[] = [];

      const updaloadData: UpdaloadData = {
        files,
        fileUploadDto,
      };

      const result = await fileUploadService.fileUploadStore(updaloadData);
      expect(result).toBeInstanceOf(BadRequestException);
    });

    it('should return an array of strings', async () => {
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

      const updaloadData: UpdaloadData = {
        files,
        fileUploadDto,
      };

      const urls = await fileUploadService.fileUploadStore(updaloadData);

      expect(urls.length).toBeGreaterThan(0);
      expect(urls[0]).toBe(cloudinaryStub().secure_url);
    });

    it('should return throw error', async () => {
      const mockError = new Error('Mock Error');
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

      const updaloadData: UpdaloadData = {
        files,
        fileUploadDto,
      };

      jest.spyOn(cloudinary.uploader, 'upload').mockRejectedValue(mockError);

      try {
        await fileUploadService.fileUploadStore(updaloadData);
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });
  });

  describe('folderCase', () => {
    it('should return  BadRequestException(Store name is required)', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('AppName');
      let foldername = Folder.PRODUCTS;
      let result = fileUploadService['folderCase']({ foldername });
      expect(result).toBeInstanceOf(BadRequestException);

      jest.spyOn(configService, 'get').mockReturnValueOnce('AppName');
      foldername = Folder.STORE;
      result = fileUploadService['folderCase']({ foldername });
      expect(result).toBeInstanceOf(BadRequestException);
    });

    it('should return correct folder path for PRODUCTS folder', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('AppName');
      const foldername = Folder.PRODUCTS;
      const storename = 'store';
      const result = fileUploadService['folderCase']({ foldername, storename });

      expect(result).toMatch(
        /^AppName\/store\/products\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/,
      );
    });

    it('should return correct folder path for STORE folder', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('AppName');
      const foldername = Folder.STORE;
      const storename = 'store';
      const result = fileUploadService['folderCase']({ foldername, storename });

      expect(result).toMatch(
        /^AppName\/store\/store\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/,
      );
    });

    it('should return correct folder path for USERS folder', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('AppName');
      const foldername = Folder.USERS;
      const storename = 'store';
      const result = fileUploadService['folderCase']({ foldername, storename });

      expect(result).toMatch(
        /^AppName\/users\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/,
      );
    });
  });
});
