"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../src/auth/schemas/user.schema");
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const bcrypt = __importStar(require("bcrypt"));
describe('Employee Pulse Survey App (e2e)', () => {
    let app;
    let userModel;
    const testUsers = [
        { email: 'e2etest@example.com', password: 'password123', role: 'user' },
        { email: 'user@test.com', password: 'password123', role: 'user' },
        { email: 'admin@test.com', password: 'adminpass', role: 'admin' }
    ];
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe());
        await app.init();
        userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
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
        await (0, mongoose_2.disconnect)();
    });
    it('/auth/login (POST) - Login user', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'password123' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });
    it('/survey (POST) - Submit survey', async () => {
        const loginRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'password123' });
        const token = loginRes.body.token;
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/survey')
            .set('Authorization', `Bearer ${token}`)
            .send({ response: 'Everything is great!' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
    });
    it('/survey (GET) - Retrieve user surveys', async () => {
        const loginRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'password123' });
        const token = loginRes.body.token;
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get('/survey')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('/admin/export/csv (GET) - Export survey data as CSV (Admin)', async () => {
        const adminLogin = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@test.com', password: 'adminpass' });
        const token = adminLogin.body.token;
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get('/admin/export?format=csv')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('text/csv');
    });
    it('/admin/export/json (GET) - Export survey data as JSON (Admin)', async () => {
        const adminLogin = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@test.com', password: 'adminpass' });
        const token = adminLogin.body.token;
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get('/admin/export?format=json')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('application/json');
    });
});
//# sourceMappingURL=app.e2e-spec.js.map