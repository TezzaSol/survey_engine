import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
  IsEnum,
} from "class-validator";

enum NPS_TYPE {
  PASSIVE = "passive",
  DETRACTOR = "detractor",
}

export class CreateReviewDto {
  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number;

  @IsString()
  @IsOptional()
  countryCode: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: "phoneNumber must contain only numbers" })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @IsString()
  @IsOptional()
  recipientId: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  nps: number;

  @IsEnum(NPS_TYPE, {
    message: "npsType can only be: passive or detractor",
  })
  @IsString()
  @IsOptional()
  npsType: string;

  @IsString()
  adminId: string;
}
