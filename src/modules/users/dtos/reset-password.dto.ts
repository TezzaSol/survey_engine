// change-password.dto.ts

import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  lastname: string;

  @IsString()
  @Length(10, 50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
    message:
      "Password must be at least 10 characters long, contain letters, numbers, and special characters",
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
