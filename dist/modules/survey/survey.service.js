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
exports.SurveyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const utils_1 = require("../../../src/shared/utils");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
let SurveyService = class SurveyService {
    constructor(prisma, mailGunService) {
        this.prisma = prisma;
        this.mailGunService = mailGunService;
    }
    async createSurvey(data, userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    surveys: true,
                },
            });
            if (!user) {
                throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
            }
            if (user && user.role == "OBSERVER") {
                return { message: "Forbidden, Not authorized" };
            }
            if (user.subscriptionPlan === "BASIC" && user.surveyCount >= 5) {
                throw new common_1.HttpException("You have reached the survey limit for the BASIC plan. Please upgrade to create more surveys.", common_1.HttpStatus.FORBIDDEN);
            }
            const createSurvey = await this.prisma.survey.create({
                data: {
                    heading: data.heading,
                    subHeading: data.subHeading,
                    questionType: data.questionType,
                    createdById: userId,
                    adminId: user.adminId,
                    questions: {
                        create: data.questions.map((question) => ({
                            question: question.question,
                            questionType: question.questionType,
                            nps: question.nps,
                            required: question.required,
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
            const publishUrl = `${process.env.WEBSITE_URL}/${createSurvey.questionType}?id=${createSurvey.id}`;
            const subject = "Your Survey Is Ready!";
            const templateName = "survey-confirmation";
            const context = {
                user: user?.firstname || "there",
                surveyTitle: data.heading,
                appName: process.env.APP_NANE,
            };
            await this.mailGunService.sendEmailWithTemplate({
                to: user.email,
                subject,
                templateName,
                context,
            });
            const updatedSurvey = await this.prisma.survey.update({
                where: { id: createSurvey.id },
                data: {
                    publishUrl,
                },
            });
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    surveyCount: { increment: 1 },
                },
            });
            const response = { ...updatedSurvey, publishUrl };
            return utils_1.Utils.response({
                message: "Survey Succesfully Created",
                data: {
                    response,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error("Internal server error:", error);
            throw new common_1.HttpException("An internal error occurred. Please try again later.", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllSurveys0(paramsObj, userId) {
        console.log(userId);
        const pageNumber = paramsObj.pageNumber || 1;
        const pageSize = paramsObj.pageSize || 10;
        const skip = (pageNumber - 1) * pageSize;
        const orderBy = paramsObj.sortBy || "id";
        const search = paramsObj.search;
        const orderDirection = paramsObj.sortDir || "desc";
        const startDate = paramsObj.startDate || null;
        const endDate = paramsObj.endDate || null;
        const dateParams = {
            createdAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
        };
        const filterParams = search
            ? {
                OR: [
                    { heading: { contains: search, mode: "insensitive" } },
                    { subHeading: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const surveyCount = await this.prisma.survey.aggregate({
            where: {
                createdById: userId,
            },
            _count: true,
        });
        const surveys = await this.prisma.survey.findMany({
            take: Number(pageSize + 1),
            skip,
            where: {
                ...filterParams,
                ...dateParams,
                createdById: userId,
                adminId: user.adminId ? user.adminId : undefined,
            },
            include: {
                questions: {
                    include: {
                        options: true,
                        responses: true,
                    },
                },
            },
            orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
        });
        const hasNextPage = surveys.length > pageSize;
        const edges = hasNextPage ? surveys.slice(0, pageSize) : surveys;
        const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
        const totalPages = Math.ceil(surveys.length / pageSize);
        const sortBy = orderBy;
        const q = paramsObj.search;
        const totalItems = surveyCount?._count;
        const sortDir = orderDirection;
        const enhancedSurveys = edges.map((survey) => {
            const responseCount = survey.questions.reduce((acc, question) => {
                return acc + question.responses.length;
            }, 0);
            return {
                ...survey,
                responseCount,
            };
        });
        return {
            meta: {
                q,
                startDate,
                endDate,
                sortBy,
                sortDir,
                pageSize,
                pageNumber,
                hasNextPage,
                endCursor,
                totalPages,
                totalItems,
            },
            data: enhancedSurveys,
        };
    }
    async getAllSurveys(paramsObj, userId) {
        const pageNumber = paramsObj.pageNumber || 1;
        const pageSize = paramsObj.pageSize || 10;
        const skip = (pageNumber - 1) * pageSize;
        const orderBy = paramsObj.sortBy || "id";
        const search = paramsObj.search;
        const orderDirection = paramsObj.sortDir || "desc";
        const startDate = paramsObj.startDate || null;
        const endDate = paramsObj.endDate || null;
        const dateParams = {
            createdAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
        };
        const filterParams = search
            ? {
                OR: [
                    { heading: { contains: search, mode: "insensitive" } },
                    { subHeading: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const surveyCount = await this.prisma.survey.aggregate({
            where: {
                createdById: userId,
            },
            _count: true,
        });
        const surveys = await this.prisma.survey.findMany({
            take: Number(pageSize + 1),
            skip,
            where: {
                ...filterParams,
                ...dateParams,
                createdById: userId,
                adminId: user.adminId ? user.adminId : undefined,
            },
            include: {
                questions: {
                    include: {
                        options: true,
                        responses: true,
                    },
                },
            },
            orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
        });
        const hasNextPage = surveys.length > pageSize;
        const edges = hasNextPage ? surveys.slice(0, pageSize) : surveys;
        const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
        const totalPages = Math.ceil(surveys.length / pageSize);
        const sortBy = orderBy;
        const q = paramsObj.search;
        const totalItems = surveyCount?._count;
        const sortDir = orderDirection;
        const enhancedSurveys = edges.map((survey) => {
            const uniqueRecipients = new Set();
            survey.questions.forEach((question) => {
                question.responses.forEach((response) => {
                    uniqueRecipients.add(response.recipientId);
                });
            });
            return {
                ...survey,
                responseCount: uniqueRecipients.size,
            };
        });
        return {
            meta: {
                q,
                startDate,
                endDate,
                sortBy,
                sortDir,
                pageSize,
                pageNumber,
                hasNextPage,
                endCursor,
                totalPages,
                totalItems,
            },
            data: enhancedSurveys,
        };
    }
    async getAllSurveys1() {
        const surveys = await this.prisma.survey.findMany({
            include: {
                questions: {
                    include: {
                        responses: {
                            select: {
                                _count: true,
                            },
                        },
                    },
                },
            },
        });
        const data = surveys.map((survey) => {
            const totalResponseCount = survey.questions.reduce((acc, question) => {
                return acc + question.responses.length;
            }, 0);
            return {
                ...survey,
                responseCount: totalResponseCount,
                questions: survey.questions.map((question) => ({
                    ...question,
                    responseCount: question.responses.length,
                })),
            };
        });
        return data;
    }
    async getAllSurveysbk(paramsObj, userId) {
        console.log(userId);
        const pageNumber = paramsObj.pageNumber || 1;
        const pageSize = paramsObj.pageSize || 10;
        const skip = (pageNumber - 1) * pageSize;
        const orderBy = paramsObj.sortBy || "id";
        const search = paramsObj.search;
        const orderDirection = paramsObj.sortDir || "desc";
        const startDate = paramsObj.startDate || null;
        const endDate = paramsObj.endDate || null;
        const dateParams = {
            createdAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
        };
        const filterParams = search
            ? {
                OR: [
                    { heading: { contains: search, mode: "insensitive" } },
                    { subHeading: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const surveyCount = await this.prisma.survey.aggregate({
            where: {
                createdById: userId,
            },
            _count: true,
        });
        const surveys = await this.prisma.survey.findMany({
            take: Number(pageSize + 1),
            skip,
            where: {
                ...filterParams,
                ...dateParams,
                createdById: userId,
                adminId: user.adminId != null ? user.adminId : null,
            },
            include: {
                questions: {
                    include: {
                        options: true,
                        responses: true,
                    },
                },
            },
            orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
        });
        const hasNextPage = surveys.length > pageSize;
        const edges = hasNextPage ? surveys.slice(0, pageSize) : surveys;
        const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
        const totalPages = Math.ceil(surveys.length / pageSize);
        const sortBy = orderBy;
        const q = paramsObj.search;
        const totalItems = surveyCount?._count;
        const sortDir = orderDirection;
        return {
            meta: {
                q,
                startDate,
                endDate,
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
    async getSurveyById(id) {
        const survey = await this.prisma.survey.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
        await utils_1.Utils.checkEntityExists(survey, id, "Survey");
        return survey;
    }
    async updateSurveyWorking(id, data) {
        try {
            const existingSurvey = await this.prisma.survey.findUnique({
                where: { id },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            if (!existingSurvey) {
                throw new common_1.HttpException("Survey not found", common_1.HttpStatus.NOT_FOUND);
            }
            for (const question of existingSurvey.questions) {
                await this.prisma.option.deleteMany({
                    where: { questionId: question.id },
                });
            }
            await this.prisma.question.deleteMany({
                where: { surveyId: id },
            });
            const updatedSurvey = await this.prisma.survey.update({
                where: { id },
                data: {
                    heading: data.heading,
                    subHeading: data.subHeading,
                    questionType: data.questionType,
                    questions: {
                        create: data.questions.map((question) => ({
                            question: question.question,
                            questionType: question.questionType,
                            nps: question.nps,
                            required: question.required,
                            options: {
                                create: question.options.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                })),
                            },
                        })),
                    },
                    updatedAt: new Date(),
                },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            const publishUrl = `${process.env.WEBSITE_URL}/${updatedSurvey.questionType}?id=${updatedSurvey.id}`;
            const finalUpdatedSurvey = await this.prisma.survey.update({
                where: { id: updatedSurvey.id },
                data: { publishUrl },
            });
            const response = { ...finalUpdatedSurvey, publishUrl };
            return utils_1.Utils.response({
                message: "Survey Successfully Updated",
                data: {
                    response,
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteOptionsForQuestion(questionId) {
        const options = await this.prisma.option.findMany({
            where: { questionId },
            select: { id: true },
        });
        const optionIds = options.map((option) => option.id);
        if (optionIds.length > 0) {
            await this.prisma.surveyResponseOption.deleteMany({
                where: { optionId: { in: optionIds } },
            });
            await this.prisma.option.deleteMany({
                where: { id: { in: optionIds } },
            });
        }
    }
    async deleteResponsesForQuestion(questionId) {
        await this.prisma.surveyResponse.deleteMany({
            where: { questionId },
        });
    }
    async updateSurvey(id, data) {
        try {
            const existingSurvey = await this.prisma.survey.findUnique({
                where: { id },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            if (!existingSurvey) {
                throw new common_1.HttpException("Survey not found", common_1.HttpStatus.NOT_FOUND);
            }
            for (const question of existingSurvey.questions) {
                await this.deleteResponsesForQuestion(question.id);
                await this.deleteOptionsForQuestion(question.id);
                await this.prisma.question.delete({
                    where: { id: question.id },
                });
            }
            const updatedSurvey = await this.prisma.survey.update({
                where: { id },
                data: {
                    heading: data.heading,
                    subHeading: data.subHeading,
                    questionType: data.questionType,
                    questions: {
                        create: data.questions.map((question) => ({
                            question: question.question,
                            questionType: question.questionType,
                            nps: question.nps,
                            required: question.required,
                            options: {
                                create: question.options.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                })),
                            },
                        })),
                    },
                    updatedAt: new Date(),
                },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            const publishUrl = `${process.env.WEBSITE_URL}/${updatedSurvey.questionType}?id=${updatedSurvey.id}`;
            const finalUpdatedSurvey = await this.prisma.survey.update({
                where: { id: updatedSurvey.id },
                data: { publishUrl },
            });
            const response = { ...finalUpdatedSurvey, publishUrl };
            return utils_1.Utils.response({
                message: "Survey Successfully Updated",
                data: {
                    response,
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSurveyTesting(id, data) {
        try {
            const existingSurvey = await this.prisma.survey.findUnique({
                where: { id },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            if (!existingSurvey) {
                throw new common_1.HttpException("Survey not found", common_1.HttpStatus.NOT_FOUND);
            }
            const existingQuestionIds = existingSurvey.questions.map((q) => q.id);
            const updatedQuestionIds = data.questions
                .map((q) => q.id)
                .filter(Boolean);
            const questionIdsToDelete = existingQuestionIds.filter((id) => !updatedQuestionIds.includes(id));
            for (const questionId of questionIdsToDelete) {
                await this.deleteResponsesForQuestion(questionId);
                await this.deleteOptionsForQuestion(questionId);
                await this.prisma.question.delete({ where: { id: questionId } });
            }
            const updatedSurvey = await this.prisma.survey.update({
                where: { id },
                data: {
                    heading: data.heading,
                    subHeading: data.subHeading,
                    questionType: data.questionType,
                    questions: {
                        upsert: data.questions.map((question) => ({
                            where: { id: question.id || "nonexistent-id" },
                            create: {
                                question: question.question,
                                questionType: question.questionType,
                                nps: question.nps,
                                required: question.required,
                                surveyId: question.id,
                                options: {
                                    create: question.options.map((option) => ({
                                        value: option.value,
                                        label: option.label,
                                    })),
                                },
                            },
                            update: {
                                question: question.question,
                                questionType: question.questionType,
                                nps: question.nps,
                                required: question.required,
                                options: {
                                    deleteMany: {},
                                    create: question.options.map((option) => ({
                                        value: option.value,
                                        label: option.label,
                                    })),
                                },
                            },
                        })),
                    },
                    updatedAt: new Date(),
                },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            const publishUrl = `${process.env.WEBSITE_URL}/${updatedSurvey.questionType}?id=${updatedSurvey.id}`;
            const finalUpdatedSurvey = await this.prisma.survey.update({
                where: { id: updatedSurvey.id },
                data: { publishUrl },
            });
            const response = { ...finalUpdatedSurvey, publishUrl };
            return utils_1.Utils.response({
                message: "Survey Successfully Updated",
                data: {
                    response,
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSurveyWithoutResponses(id, data) {
        try {
            const existingSurvey = await this.prisma.survey.findUnique({
                where: { id },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            if (!existingSurvey) {
                throw new common_1.HttpException("Survey not found", common_1.HttpStatus.NOT_FOUND);
            }
            const existingQuestionIds = existingSurvey.questions.map((q) => q.id);
            const incomingQuestionIds = data.questions
                .map((q) => q.id)
                .filter(Boolean);
            const questionsToDelete = existingQuestionIds.filter((id) => !incomingQuestionIds.includes(id));
            for (const questionId of questionsToDelete) {
                await this.prisma.option.deleteMany({
                    where: { questionId },
                });
                await this.prisma.question.delete({
                    where: { id: questionId },
                });
            }
            for (const questionData of data.questions) {
                if (questionData.id && existingQuestionIds.includes(questionData.id)) {
                    await this.prisma.question.update({
                        where: { id: questionData.id },
                        data: {
                            question: questionData.question,
                            questionType: questionData.questionType,
                            nps: questionData.nps,
                            required: questionData.required,
                        },
                    });
                    await this.prisma.option.deleteMany({
                        where: { questionId: questionData.id },
                    });
                    await this.prisma.option.createMany({
                        data: questionData.options.map((option) => ({
                            questionId: questionData.id,
                            value: option.value,
                            label: option.label,
                        })),
                    });
                }
                else {
                    await this.prisma.question.create({
                        data: {
                            surveyId: id,
                            question: questionData.question,
                            questionType: questionData.questionType,
                            nps: questionData.nps,
                            required: questionData.required,
                            options: {
                                create: questionData.options.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                })),
                            },
                        },
                    });
                }
            }
            const updatedSurvey = await this.prisma.survey.update({
                where: { id },
                data: {
                    heading: data.heading,
                    subHeading: data.subHeading,
                    questionType: data.questionType,
                    updatedAt: new Date(),
                },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            const publishUrl = `${process.env.WEBSITE_URL}/${updatedSurvey.questionType}?id=${updatedSurvey.id}`;
            await this.prisma.survey.update({
                where: { id: updatedSurvey.id },
                data: { publishUrl },
            });
            const response = { ...updatedSurvey, publishUrl };
            return utils_1.Utils.response({
                message: "Survey Successfully Updated",
                data: { response },
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSurveyStatus(surveyId, updateSurveyStatus) {
        try {
            const surveyExists = await this.prisma.survey.findFirst({
                where: { id: surveyId },
            });
            if (!surveyExists) {
                throw new common_1.NotFoundException("Survey does not exist");
            }
            const statusUpdate = this.prisma.survey.update({
                where: { id: surveyId },
                data: { status: updateSurveyStatus.status },
            });
            return statusUpdate;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || 500);
        }
    }
    async deleteSurvey(id) {
        const survey = await this.prisma.survey.findUnique({
            where: { id },
        });
        if (!survey) {
            throw new common_1.NotFoundException(`Survey with id ${id} does not exist.`);
        }
        const questions = await this.prisma.question.findMany({
            where: { surveyId: id },
            include: {
                options: true,
                responses: { include: { options: true } },
            },
        });
        for (const question of questions) {
            for (const response of question.responses) {
                await this.prisma.surveyResponseOption.deleteMany({
                    where: { surveyResponseId: response.id },
                });
            }
            await this.prisma.surveyResponse.deleteMany({
                where: { questionId: question.id },
            });
            await this.prisma.option.deleteMany({
                where: { questionId: question.id },
            });
        }
        await this.prisma.question.deleteMany({
            where: { surveyId: id },
        });
        return this.prisma.survey.delete({
            where: { id },
        });
    }
};
SurveyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailGunService])
], SurveyService);
exports.SurveyService = SurveyService;
//# sourceMappingURL=survey.service.js.map