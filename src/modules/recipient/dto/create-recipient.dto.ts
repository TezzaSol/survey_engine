import { Transform } from "class-transformer";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  ValidateIf,
  IsNumber,
  IsInt,
} from "class-validator";

export class CreateRecipientDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  // @IsInt()
  // @IsOptional()
  // phoneNumber?: number;

  @ValidateIf((obj) => obj.phoneNumber !== null)
  @IsString()
  @Transform(({ value }) => value.toString())
  phoneNumber: string | null;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  listId: string;
}
