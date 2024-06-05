import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [FileUploadController],
  imports: [AuthModule],
  providers: [FileUploadService],
})
export class FileUploadModule {}
