
import { IsString, IsArray, ValidateNested, IsInt, IsOptional, ValidateIf, IsNumber } from "class-validator";
import { Type } from "class-transformer";


class CreateSurveyResponseDto {
  @IsString()
  questionId: string;

  @IsOptional()
  @ValidateIf((obj) => typeof obj.value === "number")
  @IsNumber()
  answer: number[] | number;

  @IsString()
  recipientId: string;

}



export class CreateSurveyResponsesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyResponseDto)
  responses: CreateSurveyResponseDto[];

  @IsOptional()
  @IsString()
  surveyId?: string;

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

