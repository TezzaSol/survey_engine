import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { Transform } from "class-transformer";
import { PlatformName } from "./platform-name.enum";

export class CreatePlatformDto {
  @IsEnum(PlatformName, {
    message: "Platform name must be one of: Facebook, Google, Yelp",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  })
  name: PlatformName;

  @IsUrl()
  @IsOptional()
  url: string;

  @IsOptional()
  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsDateString()
  tokenExpireAt: string;
}
