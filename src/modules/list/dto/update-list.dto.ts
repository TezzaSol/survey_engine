import { IsString, IsOptional } from "class-validator";

export class UpdateListDto {
  @IsString()
  @IsOptional()
  name?: string;
}
