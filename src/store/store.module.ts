import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entities/store.entity';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService],
  imports: [TypeOrmModule.forFeature([Store]), AuthModule],
  exports: [TypeOrmModule, StoreService],
})
export class StoreModule {}
