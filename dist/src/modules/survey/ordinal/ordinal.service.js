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
exports.OrdinalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/services/prisma.service");
let OrdinalService = class OrdinalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrdinalScaleSurvey(data, userId) {
        return this.prisma.ordinalScaleSurvey.create({
            data: {
                heading: data.heading,
                subHeading: data.subHeading,
                questionType: data.questionType,
                createdBy: userId,
                questions: {
                    create: data.questions.map((question) => ({
                        question: question.question,
                        options: {
                            create: question.options,
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
    }
    async getAllSurveys() {
        return this.prisma.ordinalScaleSurvey.findMany({
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
    }
    async getSurveyById(id) {
        return this.prisma.ordinalScaleSurvey.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
    }
};
OrdinalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdinalService);
exports.OrdinalService = OrdinalService;
//# sourceMappingURL=ordinal.service.js.map