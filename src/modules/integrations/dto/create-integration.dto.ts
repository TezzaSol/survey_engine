import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateIntegrationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
