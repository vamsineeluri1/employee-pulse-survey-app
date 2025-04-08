import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('survey')
@UseGuards(AuthGuard('jwt'))
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Req() req, @Body() body: { response: string }) {
    return this.surveyService.create(req.user.userId, body.response);
  }

  @Get()
  findAll(@Req() req) {
    return this.surveyService.findByUser(req.user.userId);
  }
}