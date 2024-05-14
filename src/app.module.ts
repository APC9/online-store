import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { MailerModule } from '@nestjs-modules/mailer';

import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import { ProductsModule } from './products/products.module';
import { joiValidationSchema } from './config';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryProductModule } from './category-product/category-product.module';
import { SeedModule } from './seed/seed.module';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      validationSchema: joiValidationSchema,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_POSTGRES_HOST'),
        port: configService.get<number>('DB_POSTGRES_PORT'),
        database: configService.get<string>('POSTGRES_DB'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        retryDelay: 3000,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('DB_REDIS_HOST'),
            port: configService.get<number>('DB_REDIS_PORT'),
          },
        }),
      }),
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: process.env.MAILER_TO,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    }),

    //Rate Limiting: protection atack DDoS
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),

    ProductsModule,
    FileUploadModule,
    CategoriesModule,
    CategoryProductModule,
    SeedModule,

    AuthModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
