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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const utils_1 = require("../../shared/utils");
const bcryptjs_1 = require("bcryptjs");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
let UsersService = class UsersService {
    constructor(prisma, mailGunService) {
        this.prisma = prisma;
        this.mailGunService = mailGunService;
    }
    async resetPassword(id, resetPasswordDto) {
        const { firstname, lastname, password, confirmPassword } = resetPasswordDto;
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException("Passwords do not match");
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 10);
        await this.prisma.user.update({
            where: { id },
            data: {
                firstname,
                lastname,
                password: hashedPassword,
                status: "ACTIVE"
            },
        });
        return { message: "Account Setup Successfully" };
    }
    async updateProfile(id, data) {
        try {
            const response = await this.prisma.user.update({
                where: { id },
                data,
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true,
                    phoneNumber: true,
                    department: true,
                    role: true,
                },
            });
            return utils_1.Utils.response({
                data: response,
                message: "User Profile sucessfully updated",
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
    async changePassword(userId, oldPassword, newPassword, confirmNewPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (!(await (0, bcryptjs_1.compare)(oldPassword, user.password))) {
            throw new common_1.BadRequestException("Invalid old password.");
        }
        if (newPassword !== confirmNewPassword) {
            throw new common_1.BadRequestException("New passwords do not match.");
        }
        const hashedNewPassword = await (0, bcryptjs_1.hash)(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return utils_1.Utils.response({
            message: "Password sucessfully changed",
        });
    }
    async loginActivity(id, loggedInActivity) {
        await this.prisma.user.update({
            where: { id },
            data: { loggedInActivity },
        });
        return utils_1.Utils.response({
            message: loggedInActivity
                ? "Login activity activated"
                : "Login activity deactivated",
        });
    }
    async archiveUser(userId) {
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    status: "INACTIVE",
                    isAccountArchived: true,
                },
            });
            const appName = process.env.APP_NAME;
            const subject = "Account Archived";
            const html = `Your Account has been sucessfully archived. Kindly contact the customer care to reactivate your account if you want to resume using the platform.`;
            const context = { user: user?.firstname || "there", appName };
            const templateName = "archive-account";
            await this.mailGunService.sendEmailWithTemplate({
                to: user.email,
                subject,
                templateName,
                context,
            });
            return { message: "User Account Succesfully Archived" };
        }
        catch (error) {
            throw new common_1.HttpException("Failed to archive user", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteUser(userId) {
        try {
            await this.prisma.$transaction(async (prisma) => {
                await prisma.surveyResponseOption.deleteMany({
                    where: {
                        surveyResponse: {
                            question: {
                                survey: {
                                    createdById: userId,
                                },
                            },
                        },
                    },
                });
                await prisma.surveyResponse.deleteMany({
                    where: {
                        question: {
                            survey: {
                                createdById: userId,
                            },
                        },
                    },
                });
                await prisma.option.deleteMany({
                    where: {
                        question: {
                            survey: {
                                createdById: userId,
                            },
                        },
                    },
                });
                await prisma.question.deleteMany({
                    where: {
                        survey: {
                            createdById: userId,
                        },
                    },
                });
                await prisma.survey.deleteMany({
                    where: { createdById: userId },
                });
                await prisma.loginActivity.deleteMany({
                    where: { userId },
                });
                await prisma.user.delete({
                    where: { id: userId },
                });
            });
        }
        catch (error) {
            throw new common_1.HttpException("Failed to delete user", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateThemeColor(userId, updateThemeColorDto) {
        const { primaryColor, secondaryColor } = updateThemeColorDto;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                themeColor: {
                    primaryColor: primaryColor ?? undefined,
                    secondaryColor: secondaryColor ?? undefined,
                },
            },
        });
        return { message: "Theme color updated sucessfully" };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailGunService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map