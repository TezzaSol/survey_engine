import { User } from "@prisma/client";
import { CreateUserDto } from "./dtos/create-admin.dto";
import { LoginUserDto, PasswordResetDto, ChangePassDto, TwoFADto } from "./dtos/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ResponseData } from "../../shared/interfaces";
import { MailGunService } from "../../shared/services/mailgun.service";
import { CreateAdminDto } from "./dtos/new-create-admin.dto";
import { PrismaService } from "../../shared/services/prisma.service";
export declare class AuthService {
    private prisma;
    jwtService: JwtService;
    private mailGunService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailGunService: MailGunService);
    getUserProfile(id: string): Promise<ResponseData>;
    loginUser(loginUserDto: LoginUserDto): Promise<ResponseData>;
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
    verifyUser(verificationCode: number): Promise<{
        message: string;
    }>;
    resendVerificationCode(createAdminDto: CreateAdminDto): Promise<{
        message: string;
    }>;
    login(ip: string, userAgent: string, loginUserDto: LoginUserDto): Promise<ResponseData>;
    trackLoginActivity(userId: any, ip: string, userAgent: string): Promise<void>;
    enableTwoFactorAuthAndSendCode(userId: string): Promise<ResponseData>;
    verifyTwoFactorAuth(userId: string, twoFADto: TwoFADto): Promise<ResponseData>;
    enableTwoFactorAuthWithQRCode(userId: string): Promise<{
        secret: any;
        qrCodeUrl: any;
    }>;
    sendTwoFactorCodeOld(user: any): Promise<ResponseData>;
    verifyTwoFactorCodeOld(user: any, twoFADto: TwoFADto): Promise<ResponseData>;
    findUserById(userId: string): Promise<{
        email: string;
        twoFactorCode: string;
        twoFactorExpiry: Date;
        id: string;
    }>;
    disableTwoFactorAuth(userId: string): Promise<ResponseData>;
    refreshToken(token: string): Promise<{
        access_token: string;
    }>;
    deleteUser(id: string): Promise<string>;
    sendResetPasswordEmail(passwordResetDto: PasswordResetDto): Promise<ResponseData>;
    resetPassword(changePassDto: ChangePassDto): Promise<ResponseData>;
}
