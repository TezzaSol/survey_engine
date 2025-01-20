import { IsArray, IsString } from "class-validator";

export class DeleteRecipientsDto {
  @IsArray()
  @IsString({ each: true })
  recipientIds: string[];
}
