import { getModelToken } from '@nestjs/mongoose';
import { Model, disconnect } from 'mongoose';
import { User } from '../src/auth/schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  const testUser = {
    email: 'e2etest@example.com',
    password: 'password123',
    role: 'user',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userModel = app.get<Model<User>>(getModelToken(User.name));

    // Cleanup before tests
    await userModel.deleteMany({ email: testUser.email });
  });

  afterAll(async () => {
    await userModel.deleteMany({ email: testUser.email });
    await app.close();
    await disconnect();
  });

  it('/auth/register (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toBe(testUser.email);
  });

  it('/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role');
  });
});