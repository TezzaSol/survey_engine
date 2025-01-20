import { Module } from '@nestjs/common';
import { SurveyResponseService } from './survey-response.service';
import { SurveyResponseController } from './survey-response.controller';
import { SurveyResponseRepository } from "./survey-response.repository";

@Module({
  controllers: [SurveyResponseController],
  providers: [SurveyResponseService, SurveyResponseRepository],
})
export class SurveyResponseModule {}
