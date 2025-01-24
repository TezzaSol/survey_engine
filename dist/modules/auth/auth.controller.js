"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const create_admin_dto_1 = require("./dtos/create-admin.dto");
const login_user_dto_1 = require("./dtos/login-user.dto");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const new_create_admin_dto_1 = require("./dtos/new-create-admin.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerSUperAdminUser(createUserDto) {
        return this.authService.registerSUperAdminUser(createUserDto);
    }
    async createAdmin(createUserDto) {
        return this.authService.createAdmin(createUserDto);
    }
    async verifyEmail(code) {
        return this.authService.verifyUser(code);
    }
    async resendVerificationCode(createAdminDto) {
        return this.authService.resendVerificationCode(createAdminDto);
    }
    login(req, loginUserDto) {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const userAgent = req.headers["user-agent"] || "Unknown Device";
        return this.authService.login(ip, userAgent, loginUserDto);
    }
    trackLoginActivity(req) {
        const user = req.user;
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const userAgent = req.headers["user-agent"] || "Unknown Device";
        return this.authService.trackLoginActivity(user, ip, userAgent);
    }
    async enableTwoFactorAuthAndSendCode(req) {
        const userId = req.user.sub;
        return this.authService.enableTwoFactorAuthAndSendCode(userId);
    }
    async verifyTwoFactorAuth(req, twoFADto) {
        const userId = req.user.sub;
        return this.authService.verifyTwoFactorAuth(userId, twoFADto);
    }
    async disableTwoFactorAuth(req) {
        const userId = req.user.sub;
        return this.authService.disableTwoFactorAuth(userId);
    }
    async sendTwoFactorCode(req) {
        const user = req.user;
        return this.authService.sendTwoFactorCodeOld(user);
    }
    async verifyTwoFactorCode(req, twoFADto) {
        const user = req.user;
        return this.authService.verifyTwoFactorCodeOld(user, twoFADto);
    }
    async getCurrentUser(req) {
        return this.authService.getUserProfile(req.user.sub);
    }
    async refreshToken(req) {
        if (!req.headers.authorization) {
            throw new common_1.UnauthorizedException("Authorization header not found");
        }
        const token = req.headers.authorization.split(" ")[1];
        return this.authService.refreshToken(token);
    }
    async deleteUser(id) {
        return this.authService.deleteUser(id);
    }
    async forgotPassword(passwordResetDto) {
        return this.authService.sendResetPasswordEmail(passwordResetDto);
    }
    async resetPassword(changePassDto) {
        return this.authService.resetPassword(changePassDto);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("admin/register"),
    (0, swagger_1.ApiOperation)({
        summary: "Register a new admin user",
        operationId: "create",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Created",
        type: create_admin_dto_1.CreateUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request",
        schema: {
            example: {
                message: [
                    "email must be an email",
                    "email should not be empty",
                    "password should not be empty",
                    "name should not be empty",
                ],
                error: "Bad Request",
                statusCode: 400,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Conflict",
        schema: {
            example: {
                message: "Email already registered",
                error: "Conflict",
                statusCode: 409,
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerSUperAdminUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("verify-email"),
    __param(0, (0, common_1.Query)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("resend-verification-code"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [new_create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerificationCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "trackLoginActivity", null);
__decorate([
    (0, common_1.Post)("enable-2fa-auth"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactorAuthAndSendCode", null);
__decorate([
    (0, common_1.Post)("verify-2fa-auth"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.TwoFADto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTwoFactorAuth", null);
__decorate([
    (0, common_1.Put)("disable-2fa-auth"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableTwoFactorAuth", null);
__decorate([
    (0, common_1.Post)("send-2fa-code1"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendTwoFactorCode", null);
__decorate([
    (0, common_1.Post)("verify-2fa-code2"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.TwoFADto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTwoFactorCode", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.PasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.ChangePassDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map