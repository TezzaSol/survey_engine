import { SurveyStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateSurveyStatus {
  @IsEnum(SurveyStatus)
  status: SurveyStatus;
}
