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
exports.AuthsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let AuthsService = class AuthsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async googleAcc(userId, tokens) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!currentUser) {
            throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
        }
        if (currentUser && currentUser.role != ("ADMIN" || "TEAMMATE")) {
            return { message: "Forbidden, Not authorized" };
        }
        const adminId = currentUser.adminId || currentUser.id;
        const platform = await this.prisma.platform.upsert({
            where: {
                name_userId: {
                    name: "Google",
                    userId: adminId,
                },
            },
            update: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                tokenExpireAt: tokens.expiry_date?.toString(),
                updatedAt: new Date(),
            },
            create: {
                name: "Google",
                url: "",
                userId: adminId,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                tokenExpireAt: tokens.expiry_date?.toString(),
            },
        });
        return platform;
    }
};
AuthsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthsService);
exports.AuthsService = AuthsService;
//# sourceMappingURL=auths.service.js.map