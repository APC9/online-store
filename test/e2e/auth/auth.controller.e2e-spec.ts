import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createUserDto } from './dto/create-user.dto';
import { testModule, usePipes } from '../test.module';
import { User } from '../../../src/auth/entities/user.entity';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await testModule.compile();

    app = moduleFixture.createNestApplication();
    usePipes(app);
    await app.init();
  });

  beforeEach(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(User).execute();
  });

  it('@Post("register")', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...createUserDto })
      .expect(201);

    expect(response.text).toEqual(expect.any(String));
  });
});
