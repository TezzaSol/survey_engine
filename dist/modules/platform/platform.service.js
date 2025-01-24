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
exports.PlatformService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let PlatformService = class PlatformService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPlatformDto) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!currentUser) {
            throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
        }
        if (currentUser && currentUser.role != ("ADMIN" || "TEAMMATE")) {
            return { message: "Forbidden, Not authorized" };
        }
        const platformNameExit = await this.prisma.platform.findFirst({
            where: { name: createPlatformDto.name, userId: userId },
        });
        if (platformNameExit)
            throw new common_1.ConflictException(`Platform with the name ${createPlatformDto.name} already exits`);
        const adminId = currentUser.adminId || currentUser.id;
        return this.prisma.platform.create({
            data: {
                ...createPlatformDto,
                userId: adminId,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.platform.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findOne(id, userId) {
        const platform = await this.prisma.platform.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with ID ${id} not found`);
        }
        return platform;
    }
    async update(userId, id, updatePlatformDto) {
        await this.findOne(id, userId);
        return this.prisma.platform.update({
            where: {
                id,
            },
            data: updatePlatformDto,
        });
    }
    async remove(userId, id) {
        await this.findOne(id, userId);
        return this.prisma.platform.delete({
            where: {
                id,
            },
        });
    }
    async togglePlatformStatus(userId, id) {
        const platform = await this.findOne(id, userId);
        return this.prisma.platform.update({
            where: {
                id,
            },
            data: {
                isActive: !platform.isActive,
            },
        });
    }
};
PlatformService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformService);
exports.PlatformService = PlatformService;
//# sourceMappingURL=platform.service.js.map