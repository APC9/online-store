import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { imageFileFilter } from '../../../../src/file-upload/util/file-upload.util';

describe('imageFileFilter', () => {
  const mockRequest = {} as Request;

  it('should call the callback with an error if file type is not allowed', () => {
    const mockCallback = jest.fn();
    const mockFile = {
      originalname: 'example.txt',
    } as Express.Multer.File;

    imageFileFilter(mockRequest, mockFile, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  });

  it('should call the callback with no error if file type is allowed', () => {
    const mockCallback = jest.fn();
    const mockFile = {
      originalname: 'example.jpg',
    } as Express.Multer.File;

    imageFileFilter(mockRequest, mockFile, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(null, true);
  });
});
