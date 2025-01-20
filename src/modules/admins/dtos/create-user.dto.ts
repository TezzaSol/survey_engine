// import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { Role } from "@prisma/client";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email address" })
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
    message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
  })
  email: string;

  @IsEnum(Role, { message: "Role must be either TEAMMATE or OBSERVER" })
  role: Role;

  // @IsOptional()
  // password: string;
}
