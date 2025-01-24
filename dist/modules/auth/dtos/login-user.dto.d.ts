export declare class LoginUserDto {
    email: string;
    password: string;
}
export declare class TwoFADto {
    isTwoFactorCodeActive?: Boolean;
    twoFactorCode?: string;
    twoFactorExpiry?: string;
}
export declare class PasswordResetDto {
    email: string;
}
export declare class ChangePassDto {
    token: string;
    password: string;
}
