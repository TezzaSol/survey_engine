import { SurveyStatus } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UpdateSurveyStatus {
  @IsEnum(SurveyStatus)
  status: SurveyStatus;
  // @IsString()
  // status: string
}
