import { Role, Status } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MaxLength } from "class-validator";
import { Exclude, Transform } from "class-transformer";

export class CreateUserDto {
  id: string;

  // @IsNotEmpty()
  @IsOptional()
  firstname: string;

  // @IsNotEmpty()
  @IsOptional()
  lastname: string;

  template?: string;
  context?: string[];

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  department?: string;

  role: Role;

  @IsOptional()
  @MaxLength(15, { message: "Field must be at most 15 characters long" })
  password: string;

  @IsOptional()
  status?: Status;

  @IsOptional()
  orgName?: string;
  @IsOptional()
  orgEmail?: string;
  @IsOptional()
  orgAddress?: string;
  @IsOptional()
  orgWebsite?: string;
  @IsOptional()
  logoUrl?: string;
  @IsOptional()
  themeColor?: string;
  @IsOptional()
  adminId?: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Exclude()
  password: string;

  @IsOptional()
  status?: Status;
}

export class UpdateOrgDto {
  @IsOptional()
  orgName?: string;
  @IsOptional()
  orgEmail?: string;
  @IsOptional()
  orgAddress?: string;
  @IsOptional()
  orgWebsite?: string;
  @IsOptional()
  logoUrl?: string;
  @IsOptional()
  themeColor?: string;
  @IsOptional()
  status?: Status;
}
