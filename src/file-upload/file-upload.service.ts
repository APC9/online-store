import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

import { Folder, UpdaloadData } from '../interfaces/store.interfaces';
import { FileUploadDto } from './dto/file-upload.dto';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async fileUploadStore(updaloadData: UpdaloadData) {
    const { files, fileUploadDto } = updaloadData;
    const url: string[] = [];

    const path = this.folderCase(fileUploadDto);
    if (typeof path !== 'string') return path;

    if (files.length === 0) return new BadRequestException('The file is empty');

    try {
      await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            public_id: path,
          });
          url.push(result.secure_url);
        }),
      );
      return url;
    } catch (error) {
      return error.message;
    }
  }

  private folderCase({ foldername, storename }: FileUploadDto) {
    const appName = this.configService.get<string>('APP_NAME');

    switch (foldername) {
      case Folder.PRODUCTS:
        if (!storename) {
          return new BadRequestException('Store name is required');
        }
        return `${appName}/${storename}/${Folder.PRODUCTS}/${uuidv4()}`;

      case Folder.STORE:
        if (!storename) {
          return new BadRequestException('Store name is required');
        }
        return `${appName}/${storename}/${Folder.STORE}/${uuidv4()}`;

      case Folder.USERS:
        return `${appName}/${Folder.USERS}/${uuidv4()}`;
    }
  }
}
