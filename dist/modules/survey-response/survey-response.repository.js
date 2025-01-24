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
exports.SurveyResponseRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let SurveyResponseRepository = class SurveyResponseRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findRecipientById(id) {
        return this.prisma.recipient.findUnique({
            where: { id },
        });
    }
    async hasFilledSurvey(recipientId, surveyId) {
        const count = await this.prisma.surveyResponse.count({
            where: {
                recipientId,
                question: {
                    surveyId: surveyId,
                },
            },
        });
        return count > 0;
    }
    async createResponses(deviceType, responses) {
        const createPromises = responses.map(async (response) => {
            const surveyResponse = await this.prisma.surveyResponse.create({
                data: {
                    questionId: response.questionId,
                    recipientId: response.recipientId,
                },
                include: {
                    question: true,
                },
            });
            await this.prisma.surveyResponseOption.createMany({
                data: response.optionId.map((optionId) => ({
                    surveyResponseId: surveyResponse.id,
                    optionId,
                })),
            });
            return surveyResponse;
        });
        return await Promise.all(createPromises);
    }
    async deleteResponses1(recipientId, responseIds) {
        return this.prisma.surveyResponse.deleteMany({
            where: {
                recipientId,
                id: { in: responseIds },
            },
        });
    }
    async deleteRecipientsResponses(recipientId, responseIds) {
        if (responseIds && responseIds.length > 0) {
            return this.prisma.surveyResponse.deleteMany({
                where: {
                    recipientId,
                    id: { in: responseIds },
                },
            });
        }
        return this.prisma.surveyResponse.deleteMany({
            where: { recipientId: recipientId },
        });
    }
    async deleteResponses(recipientId, responseIds) {
        return this.prisma.surveyResponse.deleteMany({
            where: {
                recipientId,
                id: { in: responseIds },
            },
        });
    }
    async deleteAllResponses(recipientId) {
        return this.prisma.surveyResponse.deleteMany({
            where: { recipientId },
        });
    }
};
SurveyResponseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SurveyResponseRepository);
exports.SurveyResponseRepository = SurveyResponseRepository;
//# sourceMappingURL=survey-response.repository.js.map