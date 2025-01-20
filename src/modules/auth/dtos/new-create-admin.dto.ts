// import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Transform } from "class-transformer";

export class CreateAdminDto {

  @IsOptional()
  verificationCodeExpiry: Date;

  @IsEmail({}, { message: "Invalid email address" })
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
    message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
  })
  email: string;
}
