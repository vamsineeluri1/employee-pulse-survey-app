import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from './schemas/survey.schema';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>
  ) {}

  create(userId: string, response: string) {
    return this.surveyModel.create({ userId, response });
  }

  findByUser(userId: string) {
    return this.surveyModel.find({ userId }).sort({ createdAt: -1 });
  }
}