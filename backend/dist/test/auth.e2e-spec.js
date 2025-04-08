"use strict";
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
describe('AuthController (e2e)', () => {
    let app;
    let userModel;
    const testUser = {
        email: 'e2etest@example.com',
        password: 'password123',
        role: 'user',
    };
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe());
        await app.init();
        userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
        // Cleanup before tests
        await userModel.deleteMany({ email: testUser.email });
    });
    afterAll(async () => {
        await userModel.deleteMany({ email: testUser.email });
        await app.close();
        await (0, mongoose_2.disconnect)();
    });
    it('/auth/register (POST)', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe(testUser.email);
    });
    it('/auth/login (POST)', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
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
//# sourceMappingURL=auth.e2e-spec.js.map