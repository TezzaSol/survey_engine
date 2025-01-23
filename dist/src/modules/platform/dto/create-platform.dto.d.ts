import { PlatformName } from "./platform-name.enum";
export declare class CreatePlatformDto {
    name: PlatformName;
    url: string;
    accessToken: string;
    refreshToken: string;
    tokenExpireAt: string;
}
