import { CreateUserDto } from "./dtos/create-admin.dto";
import { ChangePassDto, LoginUserDto, PasswordResetDto, TwoFADto } from "./dtos/login-user.dto";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";
import { ResponseData } from "../../shared/interfaces";
import { CreateAdminDto } from "./dtos/new-create-admin.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerSUperAdminUser(createUserDto: CreateUserDto): Promise<User>;
    createAdmin(createUserDto: CreateUserDto): Promise<{
        id: string;
        adminId: string;
        email: string;
        password: string;
        firstname: string;
        lastname: string;
        phoneNumber: string;
        country: string;
        department: string;
        loggedInActivity: boolean;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        isVerified: boolean;
        verificationCode: number;
        verificationCodeExpiry: Date;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        trialStartDate: Date;
        trialEndDate: Date;
        isTrialActive: boolean;
        isTwoFactorCodeActive: boolean;
        twoFactorCode: string;
        twoFactorExpiry: Date;
        isAccountArchived: boolean;
        themeColor: import(".prisma/client").Prisma.JsonValue;
        surveyCount: number;
    }>;
    verifyEmail(code: number): Promise<{
        message: string;
    }>;
    resendVerificationCode(createAdminDto: CreateAdminDto): Promise<{
        message: string;
    }>;
    login(req: any, loginUserDto: LoginUserDto): Promise<ResponseData>;
    trackLoginActivity(req: any): Promise<void>;
    enableTwoFactorAuthAndSendCode(req: any): Promise<ResponseData>;
    verifyTwoFactorAuth(req: any, twoFADto: TwoFADto): Promise<ResponseData>;
    disableTwoFactorAuth(req: any): Promise<ResponseData>;
    sendTwoFactorCode(req: any): Promise<ResponseData>;
    verifyTwoFactorCode(req: any, twoFADto: TwoFADto): Promise<ResponseData>;
    getCurrentUser(req: any): Promise<ResponseData>;
    refreshToken(req: any): Promise<{
        access_token: string;
    }>;
    deleteUser(id: string): Promise<string>;
    forgotPassword(passwordResetDto: PasswordResetDto): Promise<ResponseData>;
    resetPassword(changePassDto: ChangePassDto): Promise<ResponseData>;
}
