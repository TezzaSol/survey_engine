import { IsString, IsDateString, IsOptional } from "class-validator";

export class ScheduleSurveyDto {
  @IsDateString()
  sendAt: string; // ISO 8601 date string

  @IsString()
  publishUrl: string;

  @IsString()
  @IsOptional()
  surveyId?: string;
}
