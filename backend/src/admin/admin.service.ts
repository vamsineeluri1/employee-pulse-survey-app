import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from '../survey/schemas/survey.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>
  ) {}

  findAll() {
    return this.surveyModel.find().sort({ createdAt: -1 });
  }

  async export(format: 'csv' | 'json') {
    const surveys = await this.surveyModel.find();
    if (format === 'json') return surveys;
    const csv = ["userId,response,createdAt"].concat(
      surveys.map(s => `${s.userId},"${s.response.replace(/"/g, '""')}",${s.createdAt.toISOString()}`)
    ).join("\n");
    return csv;
  }
}