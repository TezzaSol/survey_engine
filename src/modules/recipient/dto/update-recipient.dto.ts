
import { PartialType } from "@nestjs/swagger";
import { CreateRecipientDto } from "./create-recipient.dto";

export class UpdateRecipientDto extends PartialType(CreateRecipientDto) {}


// import { IsString, IsEmail, IsOptional } from "class-validator";

// export class UpdateRecipientDto {
//   @IsString()
//   @IsOptional()
//   firsname?: string;

//   @IsEmail()
//   @IsOptional()
//   email?: string;

// }