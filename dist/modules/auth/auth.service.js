"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../../shared/utils");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const geoip = __importStar(require("geoip-lite"));
const speakeasy = __importStar(require("speakeasy"));
const qrcode = __importStar(require("qrcode"));
const prisma_service_1 = require("../../shared/services/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, mailGunService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailGunService = mailGunService;
    }
    async getUserProfile(id) {
        const user = await this.prisma.user.findFirst({
            where: { id },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                phoneNumber: true,
                department: true,
                role: true,
                organization: true,
                adminId: true,
                themeColor: true,
                trialStartDate: true,
                payments: {
                    select: {
                        billingCycle: true,
                        plan: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
                platforms: true,
            },
        });
        let admin;
        if (user?.role != "ADMIN") {
            admin = await this.prisma.user.findFirst({
                where: { id: user?.adminId },
                select: {
                    organization: true,
                },
            });
        }
        const response = { user, ...admin };
        return utils_1.Utils.response({
            data: response,
        });
    }
    async loginUser(loginUserDto) {
        try {
            const user = await this.prisma.user.findFirst({
                where: { email: loginUserDto.email },
            });
            if (!user) {
                throw new common_1.NotFoundException("Incorrect email or password.");
            }
            if (!(await (0, bcryptjs_1.compare)(loginUserDto.password, user.password))) {
                throw new common_1.UnauthorizedException("Incorrect email or password.");
            }
            const payload = { sub: user?.id, email: user?.email, roles: user?.role };
            return utils_1.Utils.response({
                data: {
                    id: user?.id,
                    email: user?.email,
                    firstname: user?.firstname,
                    lastname: user?.lastname,
                    phoneNumber: user?.phoneNumber,
                    department: user?.department,
                    role: user?.role,
                    createdAt: user?.createdAt,
                    access_token: await this.jwtService.signAsync(payload),
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
    async registerSUperAdminUser(createUserDto) {
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    email: createUserDto?.email,
                    password: await (0, bcryptjs_1.hash)(createUserDto?.password, 10),
                    firstname: createUserDto?.firstname,
                    lastname: createUserDto?.lastname,
                    phoneNumber: createUserDto?.phoneNumber,
                    department: createUserDto?.department,
                    role: client_1.Role.ADMIN,
                    organization: {
                        create: {
                            orgName: createUserDto?.orgName,
                            orgEmail: createUserDto?.orgEmail,
                            orgWebsite: createUserDto?.orgWebsite,
                            orgAddress: createUserDto?.orgAddress,
                            logoUrl: createUserDto?.logoUrl,
                            themeColor: createUserDto?.themeColor,
                        },
                    },
                },
                include: {
                    organization: true,
                },
            });
            delete newUser.password;
            return newUser;
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new common_1.ConflictException("Email already registered");
            }
            throw new common_1.HttpException(error, error.status);
        }
    }
    async createAdmin(createUserDto) {
        try {
            const { email, firstname, lastname, country } = createUserDto;
            const userExists = await this.prisma.user.findUnique({
                where: { email },
            });
            if (userExists) {
                throw new common_1.BadRequestException("Email already registered");
            }
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const verificationLink = `${process.env.WEBSITE_URL}/verify-email?email=${email}&code=${verificationCode}`;
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: await (0, bcryptjs_1.hash)(createUserDto?.password, 10),
                    firstname,
                    lastname,
                    country,
                    verificationCode,
                    isVerified: false,
                    status: "ACTIVE",
                },
            });
            const appName = process.env.APP_NAME;
            const subject = `Welcome to ${appName}! Please verify your email`;
            const html = `Proceed to verify your email with this link: ${verificationLink} <br>
                    It will expire in 15 minute.<br>
                    Your verification code is ${verificationCode}`;
            const context = {
                resetPasswordLink: verificationLink,
                verificationCode,
                appName,
                user: newUser?.firstname || "there",
            };
            await this.mailGunService.sendEmailWithTemplate({
                to: newUser.email,
                subject,
                templateName: "sign-up",
                context,
            });
            delete newUser.password;
            return newUser;
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
    async verifyUser(verificationCode) {
        const EXPIRATION_TIME_IN_MINUTES = 15;
        const user = await this.prisma.user.findFirst({
            where: { verificationCode },
        });
        if (!user) {
            throw new common_1.BadRequestException("Invalid verification code");
        }
        if (user.verificationCode !== verificationCode) {
            throw new common_1.BadRequestException("Invalid verification code");
        }
        const timeElapsedInMinutes = (new Date().getTime() - user.verificationCodeExpiry.getTime()) /
            (1000 * 60);
        console.log(timeElapsedInMinutes, " minutes have passed");
        if (timeElapsedInMinutes > EXPIRATION_TIME_IN_MINUTES) {
            throw new common_1.BadRequestException("Verification code has expired");
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationCode: null,
            },
        });
        return { message: "Email verified successfully" };
    }
    async resendVerificationCode(createAdminDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: createAdminDto?.email },
            });
            if (!user) {
                throw new common_1.BadRequestException("User not found");
            }
            if (user.isVerified) {
                throw new common_1.BadRequestException("Email is already verified");
            }
            const newVerificationCode = Math.floor(1000 + Math.random() * 9000);
            const verificationLink = `${process.env.WEBSITE_URL}/verify-email?email=${createAdminDto?.email}&code=${newVerificationCode}`;
            await this.prisma.user.update({
                where: { email: createAdminDto?.email },
                data: {
                    verificationCode: newVerificationCode,
                    verificationCodeExpiry: new Date(),
                },
            });
            const subject = "Resend Verification Code";
            const html = `Your new verification code is ${newVerificationCode}. It will expire in 15 minute.<br>
                  You can also verify using this link: ${verificationLink}`;
            await this.mailGunService.sendEmail(user.email, subject, html);
            return {
                message: "A new verification code has been sent to your email.",
            };
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
    async login(ip, userAgent, loginUserDto) {
        try {
            let location = "Unknown Location";
            if (ip) {
                const geo = geoip.lookup(ip);
                if (geo) {
                    location = `${geo.city}, ${geo.country}`;
                }
            }
            const user = await this.prisma.user.findUnique({
                where: { email: loginUserDto?.email },
                include: { platforms: true },
            });
            if (!user || !(await (0, bcryptjs_1.compare)(loginUserDto?.password, user.password))) {
                throw new common_1.UnauthorizedException("Invalid credentials");
            }
            if (user.isAccountArchived) {
                throw new common_1.UnauthorizedException("Access Denied. This account has been archived. Kindly contact the customer care to reactivate your account.");
            }
            if (!user.isVerified) {
                throw new common_1.UnauthorizedException("Email not verified. Please check your email for the verification link.");
            }
            if (user.isTwoFactorCodeActive) {
                await this.enableTwoFactorAuthAndSendCode(user.id);
            }
            if (!user.trialStartDate) {
                const trialStartDate = (0, moment_1.default)().toDate();
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        trialStartDate,
                        subscriptionPlan: "BASIC",
                        isTrialActive: true,
                    },
                });
            }
            if (!user.isTrialActive) {
                throw new common_1.UnauthorizedException("Your trial period has ended. Please subscribe to continue..");
            }
            const trialEndDate = (0, moment_1.default)(user.trialStartDate).add(14, "days");
            const now = (0, moment_1.default)();
            if (now.isAfter(trialEndDate)) {
                throw new common_1.UnauthorizedException("Your trial period has ended. Please subscribe to continue.");
            }
            if (user.loggedInActivity) {
                await this.trackLoginActivity(user.id, ip, userAgent);
            }
            const payload = { sub: user.id, email: user.email };
            return utils_1.Utils.response({
                data: {
                    id: user?.id,
                    adminId: user?.adminId,
                    email: user?.email,
                    firstname: user?.firstname,
                    lastname: user?.lastname,
                    country: user?.country,
                    role: user?.role,
                    createdAt: user?.createdAt,
                    trialStartDate: user?.trialStartDate,
                    isTrialActive: user?.isTrialActive,
                    loggedInActivity: user?.loggedInActivity,
                    isTwoFactorCodeActive: user?.isTwoFactorCodeActive,
                    isAccountArchived: user?.isAccountArchived,
                    themeColor: user.themeColor || {
                        primaryColor: "#373737",
                        secondaryColor: "#AA0028",
                    },
                    platforms: user.platforms,
                    access_token: await this.jwtService.signAsync(payload),
                },
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException(error, error.status);
        }
    }
    async trackLoginActivity(userId, ip, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        let location = "Unknown Location";
        if (ip) {
            const geo = geoip.lookup(ip);
            if (geo) {
                location = `${geo.city}, ${geo.country}`;
            }
        }
        const loginActivity = {
            userId: userId || "Anonymous",
            loginTime: (0, moment_1.default)().toDate(),
            ipAddress: ip?.toString(),
            deviceInfo: userAgent,
            location,
        };
        await this.prisma.loginActivity.create({
            data: {
                ...loginActivity,
            },
        });
        const subject = "New Login Activity";
        const html = `These are the details of the recent login activities: <br /> ${JSON.stringify(loginActivity)}.`;
        await this.mailGunService.sendEmail(user.email, subject, html);
    }
    async enableTwoFactorAuthAndSendCode(userId) {
        const secret = speakeasy.generateSecret({ name: "TezzaSurveyEngine" });
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                isTwoFactorCodeActive: true,
                twoFactorCode: secret.base32,
            },
        });
        const token = speakeasy.totp({
            secret: secret.base32,
            encoding: "base32",
        });
        const subject = "Your 2FA Code";
        const html = `Your 2FA code is: ${token}.`;
        await this.mailGunService.sendEmail(user.email, subject, html);
        return { message: `2FA enabled, code sent to ${user.email}` };
    }
    async verifyTwoFactorAuth(userId, twoFADto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isTwoFactorCodeActive || !user.twoFactorCode) {
            throw new Error("Two-factor authentication is not enabled for this user");
        }
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorCode,
            encoding: "base32",
            token: twoFADto.twoFactorCode,
            window: 1,
        });
        console.log("verified", verified);
        if (user.isTwoFactorCodeActive) {
            if (!twoFADto.twoFactorCode) {
                throw new common_1.UnauthorizedException("Two-factor authentication code is required");
            }
            if (!verified) {
                throw new common_1.UnauthorizedException("Invalid two-factor authentication code");
            }
        }
        return { message: "2FA Sucessfully verified" };
    }
    async enableTwoFactorAuthWithQRCode(userId) {
        const secret = speakeasy.generateSecret({ name: "YourAppName" });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isTwoFactorCodeActive: true,
                twoFactorCode: secret.base32,
            },
        });
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        return {
            secret: secret.base32,
            qrCodeUrl,
        };
    }
    async sendTwoFactorCodeOld(user) {
        try {
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
            const twoFactorExpiry = (0, moment_1.default)().add(15, "minutes").toDate();
            await this.prisma.user.update({
                where: { id: user.sub },
                data: {
                    twoFactorCode,
                    twoFactorExpiry,
                    isTwoFactorCodeActive: true,
                },
            });
            const subject = "Your 2FA Code";
            const html = `Your 2FA code is: ${twoFactorCode}. It will expire in 15 minutes.`;
            await this.mailGunService.sendEmail(user.email, subject, html);
            return { message: "2FA code sent successfully" };
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
    async verifyTwoFactorCodeOld(user, twoFADto) {
        try {
            if (!user) {
                throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
            }
            const userWithTwoFactor = await this.prisma.user.findUnique({
                where: { id: user?.sub },
            });
            if (userWithTwoFactor.twoFactorCode !== twoFADto.twoFactorCode ||
                new Date(userWithTwoFactor.twoFactorExpiry) < new Date()) {
                throw new common_1.HttpException("Invalid or expired 2FA code", common_1.HttpStatus.BAD_REQUEST);
            }
            return { message: "2FA verified successfully" };
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
    async findUserById(userId) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                twoFactorCode: true,
                twoFactorExpiry: true,
            },
        });
    }
    async disableTwoFactorAuth(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorCode: null,
                isTwoFactorCodeActive: false,
            },
        });
        return { message: "2FA Auth Successfully disabled" };
    }
    async refreshToken(token) {
        const payload = this.jwtService.verify(token);
        return { access_token: this.jwtService.sign(payload) };
    }
    async deleteUser(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            await this.prisma.user.delete({
                where: { id },
            });
            return `user with id ${user.id} deleted`;
        }
        catch (error) {
            if (error.code === "P2025") {
                throw new common_1.NotFoundException(`user with id ${id} not found`);
            }
            throw new common_1.HttpException(error, 500);
        }
    }
    async sendResetPasswordEmail(passwordResetDto) {
        const user = await this.prisma.user.findFirst({
            where: { email: passwordResetDto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("invalid email address");
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const resetLink = `${process.env.WEBSITE_URL}/reset-password/?token=${token}`;
        const subject = "Reset your password";
        const context = { user: user?.firstname || "there", resetLink };
        const templateName = "forgot-password";
        await this.mailGunService.sendEmailWithTemplate({
            to: passwordResetDto.email,
            subject,
            templateName,
            context,
        });
        return utils_1.Utils.response({
            message: `password reset link with instructions has been sent to '${passwordResetDto.email}`,
        });
    }
    async resetPassword(changePassDto) {
        try {
            const decoded = this.jwtService.verify(changePassDto.token);
            if (!decoded || !decoded.userId) {
                throw new common_1.UnauthorizedException("Invalid token");
            }
            const userId = decoded.userId;
            const hashedPassword = await (0, bcryptjs_1.hash)(changePassDto.password, 10);
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedPassword,
                    status: client_1.Status.ACTIVE,
                },
            });
            delete updatedUser.password;
            return utils_1.Utils.response({
                message: "Password reset successfully",
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid token");
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mailgun_service_1.MailGunService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map