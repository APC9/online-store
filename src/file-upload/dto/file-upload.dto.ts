import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsOptional } from 'class-validator';
import { Folder } from '../../interfaces/store.interfaces';

export class FileUploadDto {
  @ApiProperty({
    example: 'products',
    enum: [Folder.PRODUCTS, Folder.STORE, Folder.USERS],
  })
  @IsIn([Folder.PRODUCTS, Folder.STORE, Folder.USERS])
  foldername: Folder;

  @ApiProperty({
    required: false,
    example: 'My-online-store',
    description:
      'Note: It is optional for the users folder, for the products and store folders it is required.',
  })
  @IsString()
  @IsOptional()
  storename?: string;
}
