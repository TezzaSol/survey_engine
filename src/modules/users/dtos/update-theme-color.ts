// update-theme-color.dto.ts
import { IsOptional, IsString, Matches } from "class-validator";

export class UpdateThemeColorDto {
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6})$/, {
    message: "Primary color must be a valid hex code",
  })
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6})$/, {
    message: "Secondary color must be a valid hex code",
  })
  secondaryColor?: string;
}
