import { FileUploadDto } from 'src/file-upload/dto/file-upload.dto';

export interface UpdaloadData {
  files: Express.Multer.File[];
  fileUploadDto: FileUploadDto;
}

export enum Folder {
  PRODUCTS = 'products',
  STORE = 'store',
  USERS = 'users',
}
