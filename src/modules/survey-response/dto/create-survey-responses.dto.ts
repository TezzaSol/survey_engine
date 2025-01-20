import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateSurveyResponseDto } from "./create-survey-response.dto";

export class CreateSurveyResponsesDto {
  @IsOptional()
  @IsString()
  recipientId?: string;
  
  @IsNotEmpty()
  @IsString()
  surveyId: string;
  

  @ValidateNested({ each: true })
  @Type(() => CreateSurveyResponseDto)
  responses: CreateSurveyResponseDto[];
}
