// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-pulse');

  app.enableCors();
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}
bootstrap();


// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './survey/survey.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-pulse'),
    AuthModule,
    SurveyModule,
    ExportModule,
  ],
})
export class AppModule {}


// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}


// backend/src/auth/user.schema.ts
import { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  role: 'employee' | 'admin';
}

export const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' }
});


// backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword, role });
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}


// backend/src/auth/auth.controller.ts
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.role);
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }
}


// backend/src/survey/survey.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveySchema } from './survey.schema';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Survey', schema: SurveySchema }]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}


// backend/src/survey/survey.schema.ts
import { Schema, Document } from 'mongoose';

export interface Survey extends Document {
  userId: string;
  surveyDate: Date;
  answers: string[];
}

export const SurveySchema = new Schema<Survey>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  surveyDate: { type: Date, default: Date.now },
  answers: [{ type: String, required: true }]
});


// backend/src/survey/survey.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from './survey.schema';

@Injectable()
export class SurveyService {
  constructor(@InjectModel('Survey') private surveyModel: Model<Survey>) {}

  async createSurvey(userId: string, answers: string[]) {
    const survey = new this.surveyModel({ userId, answers });
    return survey.save();
  }

  async getAllSurveys() {
    return this.surveyModel.find().populate('userId');
  }
}


// backend/src/survey/survey.controller.ts
import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.surveyService.createSurvey(req.user.userId, body.answers);
  }

  @Get()
  async getAll() {
    return this.surveyService.getAllSurveys();
  }
}
