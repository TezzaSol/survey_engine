// // import { PartialType } from '@nestjs/swagger';
// // import { CreateSurveyDto } from './create-survey.dto';

// // export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {}

// import { IsString, IsArray, ValidateNested, IsBoolean, IsOptional, IsNumber, ValidateIf, IsEnum } from "class-validator";
// import { Transform, Type } from "class-transformer";
// import { SurveyQuestionType } from "@prisma/client";
// // import { SurveyQuestionType } from "../interface/survey-question-type";

// class UpdateOptionDto {

//     @IsOptional()
//     @ValidateIf((obj) => typeof obj.value === "number")
//     @IsNumber()
//     value: number[] | number;

//   @IsString()
//   label: string;
// }

// class UpdateQuestionDto {
//   @IsString()
//   question: string;

//   // @Transform(({ value }) => value.toLowerCase())
//   @IsEnum(SurveyQuestionType)
//   questionType?: SurveyQuestionType;

//   @IsBoolean()
//   nps: boolean;

//   @IsBoolean()
//   required: boolean;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateOptionDto)
//   options: UpdateOptionDto[];
// }

// export class UpdateSurveyDto {
//   @IsString()
//   heading: string;

//   @IsString()
//   subHeading: string;

//   // @Transform(({ value }) => value.toLowerCase())
//   @IsEnum(SurveyQuestionType)
//   questionType?: SurveyQuestionType;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateQuestionDto)
//   questions: UpdateQuestionDto[];
// }
import {
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
  IsNumber,
  ValidateIf,
  IsEnum,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { SurveyQuestionType } from "@prisma/client";

class UpdateOptionDto {
  @IsOptional()
  @ValidateIf((obj) => typeof obj.value === "number")
  @IsNumber()
  value: number[] | number;

  @IsString()
  label: string;
}

class UpdateQuestionDto {
  @IsOptional()
  // @IsString()
  id?: any; // Optional ID to identify existing questions

  @IsString()
  question: string;

  @IsEnum(SurveyQuestionType)
  questionType?: SurveyQuestionType;

  @IsBoolean()
  nps: boolean;

  @IsBoolean()
  required: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  options: UpdateOptionDto[];
}

export class UpdateSurveyDto {
  @IsString()
  heading: string;

  @IsString()
  subHeading: string;

  @IsEnum(SurveyQuestionType)
  questionType?: SurveyQuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions: UpdateQuestionDto[];
}
