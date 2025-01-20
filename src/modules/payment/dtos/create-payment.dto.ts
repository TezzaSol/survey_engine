import { BillingCycle } from "@prisma/client";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsMongoId,
  IsBoolean,
  IsEnum,
} from "class-validator";

export class CreatePaymentDto {
  // @IsString()
  // @IsOptional() // id is auto-generated, no need to provide it
  // id?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  paymentStatus: string;

  @IsString()
  @IsNotEmpty()
  txRef: string;

  @IsString()
  @IsNotEmpty()
  flowRef: string;

  @IsString()
  @IsNotEmpty()
  chargedAmount: string;

  @IsString()
  @IsNotEmpty()
  chargeResponseCode: string;

  @IsString()
  @IsNotEmpty()
  chargeResponseMessage: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  paymentType: string;

  // @IsString()
  // @IsOptional() // createdAt might be auto-handled in the database
  // createdAt?: string;

  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsBoolean()
  @IsOptional()
  isActive: Boolean;
}
