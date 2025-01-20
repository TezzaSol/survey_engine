import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateSurveyResponseDto {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  // @IsNotEmpty()
  // @IsString()
  // optionId: string;

  // @IsOptional()
  // @ValidateIf((obj) => typeof obj.value === "string")
  // @IsString()
  // optionId: string[] | string;

  // @IsArray()
  // @IsNotEmpty()
  // optionId: string[];

  // @IsNotEmpty()
  // optionId: any; // This can be a string or an array of strings

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  optionId: string[];

  @IsNotEmpty()
  @IsString()
  recipientId: string;

  // @IsString()
  // deviceType: string;
}
