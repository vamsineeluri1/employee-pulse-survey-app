// backend/test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Employee Pulse Survey App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - Register a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', 'user@test.com');
  });

  it('/auth/login (POST) - Login user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
  });

  it('/survey (POST) - Submit survey', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });
    const token = loginRes.body.access_token;

    const res = await request(app.getHttpServer())
      .post('/survey')
      .set('Authorization', `Bearer ${token}`)
      .send({ answers: ['Great', 'Neutral', 'Poor'] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('/survey (GET) - Retrieve user surveys', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });
    const token = loginRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/survey')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('/export/csv (GET) - Export survey data as CSV (Admin)', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'adminpass' });
    const token = adminLogin.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/export/csv')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
  });

  it('/export/json (GET) - Export survey data as JSON (Admin)', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'adminpass' });
    const token = adminLogin.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/export/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('application/json');
  });
});


// backend/test/test-strategy.md
# Test Strategy

## 1. Areas to Test
- **Authentication:** Registration and Login flows.
- **Survey Management:** Submission, retrieval, and validation.
- **Admin Functionality:** Viewing and exporting survey data.
- **Edge Cases:** Unauthorized access, incorrect data format, etc.

## 2. Types of Tests
- **Unit Tests:** Testing individual services and controllers in isolation.
- **Integration Tests:** Verifying interactions between modules (e.g., auth + survey).
- **End-to-End Tests:** Simulating full workflows with HTTP requests.

## 3. Sample Test Cases
1. Register user with valid credentials → Expect 201 status.
2. Register with existing email → Expect 400 status.
3. Login with valid credentials → Expect 200 and token returned.
4. Login with invalid password → Expect 401.
5. Submit survey with valid token → Expect 201.
6. Submit survey without token → Expect 401.
7. Retrieve user surveys → Expect array of responses.
8. Export CSV (Admin) → Expect 200 and CSV format.
9. Export JSON (Admin) → Expect 200 and JSON format.
10. Access admin export as user → Expect 403.

## 4. Test Maintenance
- Use **CI/CD pipelines** to automate tests.
- Maintain test coverage reports.
- Use mock data and seeding scripts for reliable tests.
- Run tests in isolated environments (Docker containers).
