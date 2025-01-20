import { IsArray, IsOptional, IsString } from "class-validator";

export class SendInviteDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  publishUrl: string;

  @IsString()
  @IsOptional()
  surveyId?: string;
}
