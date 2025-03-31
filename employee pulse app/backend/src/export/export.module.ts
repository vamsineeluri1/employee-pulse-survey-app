// backend/src/export/export.module.ts
import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveySchema } from '../survey/survey.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Survey', schema: SurveySchema }]),
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}


// backend/src/export/export.controller.ts
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('export')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('csv')
  async exportCSV(@Res() res: Response) {
    const csvData = await this.exportService.exportToCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('survey-data.csv');
    res.send(csvData);
  }

  @Get('json')
  async exportJSON(@Res() res: Response) {
    const jsonData = await this.exportService.exportToJSON();
    res.header('Content-Type', 'application/json');
    res.attachment('survey-data.json');
    res.send(jsonData);
  }
}


// backend/src/export/export.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from '../survey/survey.schema';
import { Parser as Json2CsvParser } from 'json2csv';

@Injectable()
export class ExportService {
  constructor(@InjectModel('Survey') private surveyModel: Model<Survey>) {}

  async exportToCSV(): Promise<string> {
    const surveys = await this.surveyModel.find().populate('userId');
    const data = surveys.map((s) => ({
      user: s.userId.email,
      date: s.surveyDate,
      answers: s.answers.join(', '),
    }));

    const json2csv = new Json2CsvParser({ fields: ['user', 'date', 'answers'] });
    return json2csv.parse(data);
  }

  async exportToJSON(): Promise<string> {
    const surveys = await this.surveyModel.find().populate('userId');
    const data = surveys.map((s) => ({
      user: s.userId.email,
      date: s.surveyDate,
      answers: s.answers,
    }));
    return JSON.stringify(data, null, 2);
  }
}


// backend/src/auth/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.user && request.user.role === 'admin';
  }
}
