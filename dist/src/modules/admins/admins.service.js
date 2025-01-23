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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const client_1 = require("@prisma/client");
const utils_1 = require("../../shared/utils");
const bcryptjs_1 = require("bcryptjs");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
let AdminsService = class AdminsService {
    constructor(prisma, mailGunService) {
        this.prisma = prisma;
        this.mailGunService = mailGunService;
    }
    async createUser(id, input) {
        try {
            const { email, role } = input;
            const admin = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    subscriptionPlan: true,
                    trialStartDate: true,
                },
            });
            if (!admin) {
                throw new common_1.NotFoundException("Admin not found");
            }
            if (admin.subscriptionPlan === "BASIC") {
                const userCount = await this.prisma.user.count({
                    where: { adminId: id },
                });
                if (userCount >= 2) {
                    throw new common_1.ForbiddenException("You have reached the user limit for the BASIC plan. Please upgrade to add more users.");
                }
            }
            if (role !== client_1.Role.TEAMMATE && role !== client_1.Role.OBSERVER) {
                throw new common_1.BadRequestException("Invalid role. Only TEAMMATE or OBSERVER are allowed.");
            }
            const user = await this.prisma.user.findFirst({
                where: { email: input?.email },
            });
            if (user)
                throw new common_1.ConflictException("User already exists");
            const auto_password = `${utils_1.Utils.unixTimestamp()}`;
            const hashed_password = await (0, bcryptjs_1.hash)(auto_password, 10);
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const verificationLink = `${process.env.WEBSITE_URL}/verify-email?email=${email}&code=${verificationCode}`;
            const response = await this.prisma.user.create({
                data: {
                    email,
                    role,
                    password: hashed_password,
                    adminId: id,
                    verificationCode,
                    isVerified: true,
                    verificationCodeExpiry: null,
                    trialStartDate: admin.trialStartDate,
                },
            });
            const appName = process.env.APP_NAME;
            const subject = `Welcome to ${appName}! Please Verify Your Email`;
            const resetPasswordLink = `${process.env.WEBSITE_URL}/setup-account?userId=${response?.id}`;
            const context = {
                verificationLink,
                verificationCode,
                appName: appName,
            };
            await this.mailGunService.sendEmailWithTemplate({
                to: input?.email,
                subject,
                templateName: "sign-up",
                context,
            });
            return utils_1.Utils.response({
                data: {
                    email: response?.email,
                    role: response?.role,
                    status: response?.status,
                    adminId: response?.adminId,
                    trialStartDate: response?.trialStartDate,
                },
                message: "User successfully created",
            });
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new common_1.ConflictException("User already registered");
            }
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createUser0(id, input) {
        try {
            const { email, role } = input;
            const admin = await this.prisma.user.findUnique({
                where: { id },
            });
            if (!admin) {
                throw new common_1.NotFoundException("Admin not found");
            }
            if (admin.subscriptionPlan === "BASIC") {
                const userCount = await this.prisma.user.count({
                    where: { adminId: id },
                });
                if (userCount >= 2) {
                    throw new common_1.ForbiddenException("You have reached the user limit for the BASIC plan. Please upgrade to add more users.");
                }
            }
            if (role !== client_1.Role.TEAMMATE && role !== client_1.Role.OBSERVER) {
                throw new common_1.BadRequestException("Invalid role. Only TEAMMATE or OBSERVER are allowed.");
            }
            const user = await this.prisma.user.findFirst({
                where: { email: input?.email },
            });
            if (user)
                throw new common_1.ConflictException("User already exists");
            const auto_password = `${utils_1.Utils.unixTimestamp()}`;
            const hashed_password = await (0, bcryptjs_1.hash)(auto_password, 10);
            const response = await this.prisma.user.create({
                data: {
                    email,
                    role,
                    password: hashed_password,
                    adminId: id,
                    isVerified: true,
                    verificationCodeExpiry: null,
                },
            });
            const appName = process.env.APP_NAME;
            const subject = `Welcome to ${appName}! Please Verify Your Email`;
            const resetPasswordLink = `${process.env.WEBSITE_URL}/setup-account?userId=${response?.id}`;
            const context = {
                resetPasswordLink,
                appName: appName,
            };
            await this.mailGunService.sendEmailWithTemplate({
                to: input?.email,
                subject,
                templateName: "sign-up",
                context,
            });
            return utils_1.Utils.response({
                data: {
                    email: response?.email,
                    role: response?.role,
                    status: response?.status,
                    adminId: response?.adminId,
                },
                message: "User successfully created",
            });
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new common_1.ConflictException("User already registered");
            }
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findUsers(adminId, paramsObj) {
        const pageNumber = paramsObj.pageNumber || 1;
        const pageSize = paramsObj.pageSize || 10;
        const skip = (pageNumber - 1) * pageSize;
        const orderBy = paramsObj.sortBy || "id";
        const search = paramsObj.search;
        const orderDirection = paramsObj.sortDir || "desc";
        const filterParams = search
            ? {
                role: {
                    in: ["TEAMMATE", "OBSERVER"],
                },
                adminId,
                OR: [
                    { firstname: { contains: search, mode: "insensitive" } },
                    { lastname: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { status: { contains: search, mode: "insensitive" } },
                ],
            }
            : {
                role: {
                    in: ["TEAMMATE", "OBSERVER"],
                },
                adminId,
            };
        const userCount = await this.prisma.user.aggregate({
            where: {
                role: {
                    in: ["TEAMMATE", "OBSERVER"],
                },
                adminId,
            },
            _count: true,
        });
        const users = await this.prisma.user.findMany({
            take: Number(pageSize + 1),
            skip,
            where: filterParams,
            select: {
                id: true,
                adminId: true,
                email: true,
                firstname: true,
                lastname: true,
                phoneNumber: true,
                department: true,
                loggedInActivity: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
        });
        const hasNextPage = users.length > pageSize;
        const edges = hasNextPage ? users.slice(0, pageSize) : users;
        const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
        const totalPages = Math.ceil(users.length / pageSize);
        const sortBy = orderBy;
        const q = paramsObj.search;
        const totalItems = userCount?._count;
        const sortDir = orderDirection;
        return {
            meta: {
                q,
                sortBy,
                sortDir,
                pageSize,
                pageNumber,
                hasNextPage,
                endCursor,
                totalPages,
                totalItems,
            },
            data: edges,
        };
    }
    async findUsersOld(paramsObj) {
        const pageNumber = paramsObj.pageNumber || 1;
        const pageSize = paramsObj.pageSize || 10;
        const skip = (pageNumber - 1) * pageSize;
        const orderBy = paramsObj.sortBy || "id";
        const search = paramsObj.search;
        const orderDirection = paramsObj.sortDir || "desc";
        const filterParams = search
            ? {
                role: "USER",
                OR: [
                    { firstname: { contains: search, mode: "insensitive" } },
                    { lastname: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { phoneNumber: { contains: search, mode: "insensitive" } },
                    { department: { contains: search, mode: "insensitive" } },
                ],
            }
            : {
                role: "USER",
            };
        const userCount = await this.prisma.user.aggregate({
            where: {
                role: "USER",
            },
            _count: true,
        });
        const users = await this.prisma.user.findMany({
            take: Number(pageSize + 1),
            skip,
            where: filterParams,
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                phoneNumber: true,
                department: true,
                loggedInActivity: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
        });
        const hasNextPage = users.length > pageSize;
        const edges = hasNextPage ? users.slice(0, pageSize) : users;
        const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
        const totalPages = Math.ceil(users.length / pageSize);
        const sortBy = orderBy;
        const q = paramsObj.search;
        const totalItems = userCount?._count;
        const sortDir = orderDirection;
        return {
            meta: {
                q,
                sortBy,
                sortDir,
                pageSize,
                pageNumber,
                hasNextPage,
                endCursor,
                totalPages,
                totalItems,
            },
            data: edges,
        };
    }
    async findUser(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async transferRole(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
        });
        const userUpdate = this.prisma.user.update({
            where: { id },
            data,
        });
        if (data.role && data.role != user.role) {
            const appName = process.env.APP_NAME;
            const subject = `Your Role in ${appName} Has Been Updated!`;
            const templateName = "role-changed";
            const context = {
                appName,
                newRole: data.role,
                user: user?.firstname || "there",
            };
            await this.mailGunService.sendEmailWithTemplate({
                to: user.email,
                subject,
                templateName,
                context,
            });
        }
        return userUpdate;
    }
    async removeUsers(ids) {
        await this.prisma.user.deleteMany({
            where: {
                role: {
                    in: ["TEAMMATE", "OBSERVER"],
                },
                id: {
                    in: ids,
                },
            },
        });
    }
    async updateOrganizationDetails(id, data) {
        return await this.prisma.user.update({
            where: { id },
            data: {
                organization: {
                    update: {
                        orgName: data?.orgName,
                        orgEmail: data?.orgEmail,
                        orgWebsite: data?.orgWebsite,
                        orgAddress: data?.orgAddress,
                        logoUrl: data?.logoUrl,
                        themeColor: data?.themeColor,
                    },
                },
            },
            include: {
                organization: true,
            },
        });
    }
    async updateThemeColor(id, data) {
        return await this.prisma.user.update({
            where: { id },
            data: {
                organization: {
                    update: {
                        themeColor: data?.themeColor,
                    },
                },
            },
            include: {
                organization: true,
            },
        });
    }
    async updateCompanyLogo(id, logoUrl) {
        try {
            const response = await this.prisma.user.update({
                where: { id },
                data: {
                    organization: {
                        update: {
                            logoUrl: logoUrl,
                        },
                    },
                },
                include: {
                    organization: true,
                },
            });
            return utils_1.Utils.response({
                data: {
                    logoUrl: response?.organization?.logoUrl,
                },
                message: "logo successfully updated",
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, error.status);
        }
    }
};
AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailGunService])
], AdminsService);
exports.AdminsService = AdminsService;
//# sourceMappingURL=admins.service.js.map