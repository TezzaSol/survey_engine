import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator";
import { SurveyStatus, SurveyQuestionType } from "@prisma/client";

export class FilterSurveysDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @IsOptional()
  @IsEnum(SurveyQuestionType)
  surveyTemplate?: SurveyQuestionType;

  // @IsOptional()
  // @IsString({ each: true })
  // selectedSurveys?: string[];
}
