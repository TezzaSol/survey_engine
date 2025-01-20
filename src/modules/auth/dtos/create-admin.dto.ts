// import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Transform } from "class-transformer";

export class CreateUserDto {
  @IsString()
  @Length(1, 25)
  firstname: string;

  @IsString()
  @Length(1, 25)
  lastname: string;

  @IsEmail({}, { message: "Invalid email address" })
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
    message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
  })
  email: string;

  // @IsNotEmpty()
  // @IsEmail()
  // @Transform(({ value }) => value.toLowerCase())
  // email: string;

  @IsString()
  @Length(10, 50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
    message:
      "Password must be at least 10 characters long, contain letters, numbers, and special characters",
  })
  password: string;

  // @IsNotEmpty()
  // @MaxLength(15, { message: "Field must be at most 15 characters long" })
  // password: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  country: string;

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  verificationCode?: number;

  @IsOptional()
  subscriptionPlan?: string;

  @IsOptional()
  trialStartDate?: string; // Date when the free trial started

  @IsOptional()
  isTrialActive?: boolean;

  @IsOptional()
  department: string;
  /////////ORGANISATION/////////////
  @IsOptional()
  orgName: string;
  @IsOptional()
  orgEmail: string;
  @IsOptional()
  orgAddress: string;
  @IsOptional()
  orgWebsite: string;
  @IsOptional()
  logoUrl: string;
  @IsOptional()
  themeColor: string;
}
