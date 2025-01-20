import { IsString, IsArray, ValidateNested, IsNumber, IsOptional, ValidateIf, IsBoolean, IsNotEmpty, IsEnum } from "class-validator";
import { Exclude, Transform, Type } from "class-transformer";
import { SurveyQuestionType, SurveyStatus } from "@prisma/client";
// import { SurveyQuestionType } from "../interface/survey-question-type";

class CreateOptionDto {

  @IsOptional()
  @ValidateIf((obj) => typeof obj.value === "number")
  @IsNumber()
  value: number[] | number;

  @IsString()
  label: string;
}

class CreateQuestionDto {
  @IsString()
  question: string;

  @IsOptional()
  // @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SurveyQuestionType)
  questionType?: SurveyQuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

  @IsBoolean()
  @IsOptional()
  nps?: boolean;

  @IsBoolean()
  @IsOptional()
  required?: boolean;
}

export class CreateSurveyDto {
  @IsString()
  @IsOptional()
  adminId: string;

  @IsString()
  heading: string;

  @IsString()
  subHeading: string;

  // @IsNotEmpty()
  // questionType: string; //SurveyQuestionType;
  // @IsNotEmpty()
  // @IsEnum(SurveyQuestionType)
  // questionType?: SurveyQuestionType;

  @IsNotEmpty()
  // @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SurveyQuestionType)
  questionType?: SurveyQuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @IsOptional()
  status?: SurveyStatus;

  @IsBoolean()
  @IsOptional()
  nps?: boolean;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsOptional()
  responces?: Number;

  @IsOptional()
  surveyCount?: Number;

  // @Exclude()
  // updatedAt?: Date;
}
