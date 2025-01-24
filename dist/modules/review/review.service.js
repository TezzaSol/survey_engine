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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let ReviewService = class ReviewService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    setNpsType(nps) {
        if (nps <= 7)
            return "detractor";
        if (nps <= 8)
            return "passive";
    }
    async create(createReviewDto) {
        const { nps, ...restDto } = createReviewDto;
        return this.prisma.review.create({
            data: {
                ...restDto,
                nps,
                npsType: this.setNpsType(nps),
            },
        });
    }
    async findAll(userId, npsType) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!currentUser) {
            throw new common_1.NotFoundException("User not found");
        }
        const adminId = currentUser.adminId || currentUser.id;
        if (!adminId) {
            throw new common_1.NotFoundException("Admin ID not found");
        }
        const reviews = await this.prisma.review.findMany({
            where: {
                ...(npsType && { npsType }),
                adminId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return reviews;
    }
    async findOne(id) {
        const review = await this.prisma.review.findFirst({
            where: {
                id,
            },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }
    async update(id, updateReviewDto) {
        await this.findOne(id);
        return this.prisma.review.update({
            where: {
                id,
            },
            data: updateReviewDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.review.delete({
            where: {
                id,
            },
        });
    }
};
ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map