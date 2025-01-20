import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Transform } from "class-transformer";

export class LoginUserDto {
  @IsEmail({}, { message: "Invalid email address" })
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
    message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
  })
  email: string;

  @IsString()
  @Length(10, 50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
    message:
      "Password must be at least 10 characters long, contain letters, numbers, and special characters",
  })
  password: string;

}

export class TwoFADto {
  @IsBoolean()
  @IsOptional()
  isTwoFactorCodeActive?: Boolean;

  @IsString()
  @Length(1, 6)
  @IsOptional()
  twoFactorCode?: string;

  @IsString()
  @IsOptional()
  twoFactorExpiry?: string;
}

export class PasswordResetDto {
  @IsEmail({}, { message: "Invalid email address" })
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
    message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
  })
  email: string;
}

export class ChangePassDto {
  @IsNotEmpty()
  token: string;

  @IsString()
  @Length(10, 50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
    message:
      "Password must be at least 10 characters long, contain letters, numbers, and special characters",
  })
  password: string;
}
