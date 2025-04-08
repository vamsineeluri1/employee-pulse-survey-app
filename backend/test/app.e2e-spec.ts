import { getModelToken } from '@nestjs/mongoose';
import { Model, disconnect } from 'mongoose';
import { User } from '../src/auth/schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as bcrypt from 'bcrypt';

describe('Employee Pulse Survey App (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  const testUsers = [
    { email: 'e2etest@example.com', password: 'password123', role: 'user' },
    { email: 'user@test.com', password: 'password123', role: 'user' },
    { email: 'admin@test.com', password: 'adminpass', role: 'admin' }
  ];


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userModel = app.get<Model<User>>(getModelToken(User.name));
    await userModel.deleteMany({
      email: { $in: ['user@test.com', 'admin@test.com'] },
    });

    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminHashed = await bcrypt.hash('adminpass', 10);

    await userModel.insertMany([
      { email: 'user@test.com', password: hashedPassword, role: 'user' },
      { email: 'admin@test.com', password: adminHashed, role: 'admin' },
    ]);
  });

  afterAll(async () => {
    await userModel.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    await app.close();
    await disconnect();
  });

  it('/auth/login (POST) - Login user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('/survey (POST) - Submit survey', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    const token = loginRes.body.token;

    const res = await request(app.getHttpServer())
      .post('/survey')
      .set('Authorization', `Bearer ${token}`)
      .send({ response: 'Everything is great!' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('/survey (GET) - Retrieve user surveys', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    const token = loginRes.body.token;

    const res = await request(app.getHttpServer())
      .get('/survey')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/admin/export/csv (GET) - Export survey data as CSV (Admin)', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'adminpass' });

    const token = adminLogin.body.token;

    const res = await request(app.getHttpServer())
      .get('/admin/export?format=csv')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
  });

  it('/admin/export/json (GET) - Export survey data as JSON (Admin)', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'adminpass' });

    const token = adminLogin.body.token;

    const res = await request(app.getHttpServer())
      .get('/admin/export?format=json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('application/json');
  });
});