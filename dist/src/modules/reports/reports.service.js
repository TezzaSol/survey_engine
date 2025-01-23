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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSurveyStatistics(filterSurveysDto) {
        const { startDate, endDate, status, surveyTemplate } = filterSurveysDto;
        const where = {};
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (status) {
            where.status = status;
        }
        if (surveyTemplate) {
            where.questionType = surveyTemplate;
        }
        const surveys = await this.prisma.survey.findMany({
            where,
            include: { questions: { include: { responses: true } } },
        });
        const totalSurveysSent = surveys.length;
        const totalSurveysDraft = surveys.filter((s) => s.status === client_1.SurveyStatus.DRAFT).length;
        const totalSurveysPublished = surveys.filter((s) => s.status === client_1.SurveyStatus.PUBLISHED).length;
        const totalSurveysActive = surveys.filter((s) => s.status === client_1.SurveyStatus.ACTIVE).length;
        const totalSurveysClosed = surveys.filter((s) => s.status === client_1.SurveyStatus.CLOSED).length;
        const totalResponses = surveys.reduce((acc, survey) => {
            return (acc +
                survey.questions.reduce((qAcc, question) => qAcc + question.responses.length, 0));
        }, 0);
        const responseRate = (totalResponses / (totalSurveysSent || 1)) * 100;
        return {
            data: {
                totalSurveysSent,
                totalSurveysDraft,
                totalSurveysPublished,
                totalSurveysActive,
                totalSurveysClosed,
                totalResponses,
                responseRate,
            },
        };
    }
    async reports(userId, reportParam) {
        const dateParams = {
            createdAt: {
                gte: reportParam.startDate
                    ? new Date(reportParam.startDate)
                    : undefined,
                lte: reportParam.endDate ? new Date(reportParam.endDate) : undefined,
            },
        };
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const queryByRole = async (role) => {
            switch (role) {
                case "ADMIN":
                    const teammates = await this.prisma.user.findMany({
                        where: {
                            role: "TEAMMATE",
                            adminId: userId,
                        },
                    });
                    const teammateIds = teammates.map((teammate) => teammate.id);
                    const adminTeamIds = [userId, ...teammateIds];
                    return {
                        createdById: { in: adminTeamIds },
                    };
                case "OBSERVER":
                    break;
                case "TEAMMATE":
                    return { createdById: userId };
            }
        };
        const filterByUserRole = await queryByRole(currentUser.role);
        const totalSurveySent1 = await this.prisma.survey.count({
            where: {
                ...dateParams,
                status: "PUBLISHED",
                questionType: {
                    equals: client_1.SurveyQuestionType[reportParam.surveyType],
                },
                ...filterByUserRole,
            },
        });
        const totalResponses = await this.prisma.surveyResponse.findMany({
            distinct: "recipientId",
            where: {
                ...dateParams,
                question: {
                    questionType: {
                        equals: client_1.SurveyQuestionType[reportParam.surveyType],
                    },
                    survey: { ...filterByUserRole },
                },
            },
        });
        const surveyResponseQuery = async () => await this.prisma.surveyResponse.findMany({
            where: {
                ...dateParams,
                question: {
                    questionType: {
                        equals: client_1.SurveyQuestionType[reportParam.surveyType],
                    },
                    survey: { ...filterByUserRole },
                },
            },
            include: {
                recipient: true,
                question: {
                    include: {
                        survey: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
                options: {
                    include: {
                        option: true,
                    },
                },
            },
        });
        const surveyResponses = await surveyResponseQuery();
        const surveys = await this.prisma.survey.findMany({
            where: {
                ...dateParams,
                questionType: {
                    equals: client_1.SurveyQuestionType[reportParam.surveyType],
                },
                ...filterByUserRole,
            },
            include: { questions: { include: { responses: true } } },
        });
        const getYearMonthKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
        const distinctResponses = await this.prisma.surveyResponse.findMany({
            distinct: "recipientId",
            where: {
                ...dateParams,
                question: {
                    questionType: { equals: client_1.SurveyQuestionType[reportParam.surveyType] },
                    survey: { ...filterByUserRole },
                },
            },
            select: {
                createdAt: true,
            },
        });
        const groupedPublishedSurveysByDay = await this.prisma.survey.groupBy({
            by: ["createdAt"],
            _count: true,
            where: {
                ...dateParams,
                status: "PUBLISHED",
                questionType: {
                    equals: client_1.SurveyQuestionType[reportParam.surveyType],
                },
                ...filterByUserRole,
            },
        });
        const surveyTrendAnalysis = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            totalResponses: 0,
            totalPublished: 0,
        }));
        const monthlyResponseCounts = {};
        distinctResponses.forEach((response) => {
            const monthKey = getYearMonthKey(new Date(response.createdAt));
            monthlyResponseCounts[monthKey] = (monthlyResponseCounts[monthKey] || 0) + 1;
        });
        const monthlyPublishedCounts = {};
        groupedPublishedSurveysByDay.forEach((group) => {
            const monthKey = getYearMonthKey(new Date(group.createdAt));
            monthlyPublishedCounts[monthKey] = (monthlyPublishedCounts[monthKey] || 0) + group._count;
        });
        const currentYear = new Date().getFullYear();
        surveyTrendAnalysis.forEach((entry) => {
            const monthKey = `${currentYear}-${entry.month}`;
            entry.totalResponses = monthlyResponseCounts[monthKey] || 0;
            entry.totalPublished = monthlyPublishedCounts[monthKey] || 0;
        });
        const mobileUsersCount = await this.prisma.surveyResponse.count({
            where: {
                ...dateParams,
                question: {
                    questionType: {
                        equals: client_1.SurveyQuestionType[reportParam.surveyType],
                    },
                    survey: { ...filterByUserRole },
                },
                recipient: {
                    deviceType: "mobile",
                },
            },
        });
        const webUsersCount = await this.prisma.surveyResponse.count({
            where: {
                ...dateParams,
                question: {
                    questionType: {
                        equals: client_1.SurveyQuestionType[reportParam.surveyType],
                    },
                    survey: { ...filterByUserRole },
                },
                recipient: {
                    deviceType: "web",
                },
            },
        });
        const responseRateData = surveys
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6)
            .map((survey) => {
            const responses = survey.questions.map((question) => question.responses.every((response) => response.options?.length > 0));
            const totalResponses = responses.length;
            const completedCount = responses.filter(Boolean).length;
            const completedPercentage = (completedCount / totalResponses) * 100 || 0;
            const incompletedPercentage = 100 - completedPercentage;
            return {
                name: survey.heading,
                Completed: Math.round(completedPercentage),
                Incompleted: Math.round(incompletedPercentage),
            };
        });
        const totalSurveys = surveys.length;
        let publishedSurveys = 0;
        let draftSurveys = 0;
        let activeSurveys = 0;
        let closedSurveys = 0;
        let hybridSurveys = 0;
        let ordinalSurveys = 0;
        let intervalSurveys = 0;
        let ratioSurveys = 0;
        surveys.forEach((survey) => {
            switch (survey.status) {
                case "PUBLISHED":
                    publishedSurveys++;
                    break;
                case "DRAFT":
                    draftSurveys++;
                    break;
                case "ACTIVE":
                    activeSurveys++;
                    break;
                case "CLOSED":
                    closedSurveys++;
                    break;
            }
            switch (survey.questionType) {
                case "hybrid_survey":
                    hybridSurveys++;
                    break;
                case "interval_survey":
                    intervalSurveys++;
                    break;
                case "ordinal_survey":
                    ordinalSurveys++;
                    break;
                case "ratio_survey":
                    ratioSurveys++;
                    break;
            }
        });
        const percentageSurveyFor = (count) => count > 0 ? Math.round((count / totalSurveys) * 100) : 0;
        const percentageActiveSurveys = percentageSurveyFor(activeSurveys);
        const percentageClosedSurveys = percentageSurveyFor(closedSurveys);
        const percentageOrdinalSurveys = percentageSurveyFor(ordinalSurveys);
        const percentageRatioSurveys = percentageSurveyFor(ratioSurveys);
        const percentageHybridSurveys = percentageSurveyFor(hybridSurveys);
        const percentageIntervalSurveys = percentageSurveyFor(intervalSurveys);
        let promoters = 0;
        let passives = 0;
        let detractors = 0;
        function npsHandler(score) {
            if (score >= 9) {
                promoters += 1;
            }
            else if (score >= 7) {
                passives += 1;
            }
            else {
                detractors += 1;
            }
        }
        function ordinalNpsHandler(score) {
            if (score >= 4) {
                promoters += 1;
            }
            else if (score == 3) {
                passives += 1;
            }
            else {
                detractors += 1;
            }
        }
        surveyResponses.forEach((response) => {
            let question = response.question;
            let surveyQType = question.survey.questionType;
            if (surveyQType == "nps_survey") {
                response.options.forEach((responseOption) => {
                    let score = responseOption?.option?.value;
                    let maxScore = score[Object.keys(score).length - 1];
                    npsHandler(maxScore);
                });
            }
        });
        const getNpsAggregateByMonth = async () => {
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            reportParam.startDate = twelveMonthsAgo.toString();
            const monthlyData = await surveyResponseQuery();
            const monthlyAggregates = {};
            monthlyData.forEach((survey) => {
                const monthYear = survey.createdAt.toISOString().slice(0, 7);
                if (!monthlyAggregates[monthYear]) {
                    monthlyAggregates[monthYear] = {
                        month: new Date(survey.createdAt).toLocaleString("default", {
                            month: "long",
                        }),
                        year: new Date(survey.createdAt).getFullYear(),
                        promoters: 0,
                        passives: 0,
                        detractors: 0,
                        recipientSet: new Set(),
                    };
                }
                let question = survey.question;
                let surveyQType = question.survey.questionType;
                if (surveyQType == "nps_survey") {
                    survey.options.forEach((responseOption) => {
                        let score = responseOption?.option?.value;
                        let maxScore = score[Object.keys(score).length - 1];
                        if (maxScore >= 9) {
                            monthlyAggregates[monthYear]["promoters"] += 1;
                        }
                        else if (maxScore >= 7) {
                            monthlyAggregates[monthYear]["passives"] += 1;
                        }
                        else {
                            monthlyAggregates[monthYear]["detractors"] += 1;
                        }
                    });
                    monthlyAggregates[monthYear]["recipientSet"].add(survey.recipient.id);
                }
            });
            return Object.values(monthlyAggregates)
                .map((monthData) => {
                const totalResponses = monthData["recipientSet"].size || 1;
                const percentagePromoters = Math.round((monthData["promoters"] / totalResponses) * 100);
                const percentageDetractors = Math.round((monthData["detractors"] / totalResponses) * 100);
                const percentagePassives = Math.round((monthData["passives"] / totalResponses) * 100);
                return {
                    month: monthData["month"],
                    year: monthData["year"],
                    promoters: monthData["promoters"],
                    passives: monthData["passives"],
                    detractors: monthData["detractors"],
                    totalResponses: monthData["totalResponses"],
                    percentagePromoters,
                    percentagePassives,
                    percentageDetractors,
                    nps: percentagePromoters - percentageDetractors,
                };
            })
                .sort((a, b) => {
                return (new Date(`${b.year}-${b.month}`).getTime() -
                    new Date(`${a.year}-${a.month}`).getTime());
            });
        };
        const surveysNpsList = async () => {
            const groupedBySurveyId = surveyResponses.reduce((acc, response) => {
                const surveyId = response.question.surveyId;
                let question = response.question;
                let surveyQType = question.survey.questionType;
                let title = question.survey.heading;
                let publishedAt = response.question.survey?.publishedAt;
                if (!acc[surveyId]) {
                    acc[surveyId] = {
                        surveyId: surveyId,
                        title: title,
                        surveyQType: surveyQType,
                        responses: [],
                        passives: 0,
                        detractors: 0,
                        promoters: 0,
                        nps: 0,
                        percentagePromoters: null,
                        percentageDetractors: null,
                        percentagePassives: null,
                        percentageNps: null,
                        percentageResponseRate: null,
                        publishedAt: publishedAt,
                    };
                }
                acc[surveyId].responses.push(response);
                if (surveyQType == "nps_survey") {
                    response.options.forEach((responseOption) => {
                        let score = responseOption?.option?.value;
                        let maxScore = score[Object.keys(score).length - 1];
                        if (maxScore >= 9) {
                            acc[surveyId].promoters += 1;
                        }
                        else if (maxScore >= 7) {
                            acc[surveyId].passives += 1;
                        }
                        else {
                            acc[surveyId].detractors += 1;
                        }
                    });
                }
                return acc;
            }, {});
            const recipientCounter = async (lists) => await this.prisma.recipient.groupBy({
                by: ["listId"],
                _count: {
                    id: true,
                },
                where: {
                    listId: {
                        in: lists,
                    },
                },
            });
            const groupSurveys = await Promise.all(Object.values(groupedBySurveyId).map(async (group) => {
                const totalResponses = group["promoters"] + group["passives"] + group["detractors"];
                const listIds = group["responses"].map((response) => response.recipient.listId);
                const uniqueListIds = [...new Set(listIds)];
                const recipientCounts = await recipientCounter(uniqueListIds);
                const groupSurveySent = recipientCounts.reduce((sum, count) => sum + count._count.id, 0);
                const percentageNpsFor = (count) => count > 0 ? Math.round((count / totalResponses) * 100) : 0;
                if (totalResponses > 0) {
                    group["nps"] =
                        ((group["promoters"] - group["detractors"]) / totalResponses) *
                            100;
                }
                group["percentageResponseRate"] = Math.round((totalResponses / groupSurveySent) * 100);
                group["percentagePromoters"] = percentageNpsFor(group["promoters"]);
                group["percentagePassives"] = percentageNpsFor(group["passives"]);
                group["percentageDetractors"] = percentageNpsFor(group["detractors"]);
                group["percentageNps"] =
                    group["percentagePromoters"] - group["percentageDetractors"];
                return group;
            }));
            groupSurveys.map((obj) => delete obj["responses"]);
            return groupSurveys.sort((a, b) => b["percentageResponseRate"] - a["percentageResponseRate"]);
        };
        const recipientIds = totalResponses.map((response) => response.recipientId);
        const uniqueRecipientIds = [...new Set(recipientIds)];
        const distinctRecipientCount = uniqueRecipientIds.length;
        const listIds = surveyResponses.map((response) => response.recipient.listId);
        const uniqueListIds = [...new Set(listIds)];
        const recipientCounts = await this.prisma.recipient.groupBy({
            by: ["listId"],
            _count: {
                id: true,
            },
            where: {
                listId: {
                    in: uniqueListIds,
                },
            },
        });
        const totalSurveySent = recipientCounts.reduce((sum, count) => sum + count._count.id, 0);
        const totalResponseCount = totalResponses.length;
        const percentageNpsFor = (count) => count > 0 ? Math.round((count / totalResponseCount) * 100) : 0;
        const percentagePromoters = percentageNpsFor(promoters);
        const percentageDetractors = percentageNpsFor(detractors);
        const percentagePassives = percentageNpsFor(passives);
        const nps = percentagePromoters - percentageDetractors;
        const percentageResponseRate = totalResponseCount > 0
            ? Math.round((totalResponseCount / totalSurveySent) * 100)
            : 0;
        return {
            meta: {
                startDate: reportParam.startDate,
                endDate: reportParam.endDate,
                surveyType: reportParam.surveyType,
                percentageResponseRate,
                totalResponseCount,
                totalSurveys,
                totalSurveySent,
                mobile: mobileUsersCount,
                web: webUsersCount,
            },
            NpsAggregate: {
                promoters,
                passives,
                detractors,
                percentagePromoters,
                percentageDetractors,
                percentagePassives,
                nps,
            },
            surveysByTemplate: {
                ordinalSurveys,
                ratioSurveys,
                hybridSurveys,
                intervalSurveys,
            },
            surveysByStatus: {
                publishedSurveys,
                draftSurveys,
                activeSurveys,
                closedSurveys,
            },
            surveyResponses: await surveysNpsList(),
            monthlyNpsAggregates: await getNpsAggregateByMonth(),
            surveyTrendAnalysis,
            responseRateData,
        };
    }
    async reportsOptimized(reportParam, deviceType) {
        const dateParams = {
            createdAt: {
                gte: reportParam.startDate
                    ? new Date(reportParam.startDate)
                    : undefined,
                lte: reportParam.endDate ? new Date(reportParam.endDate) : undefined,
            },
        };
        const surveyType = client_1.SurveyQuestionType[reportParam.surveyType];
        const [totalResponses, questions, surveyResponses, surveys] = await Promise.all([
            this.prisma.surveyResponse.findMany({
                distinct: "recipientId",
                where: {
                    ...dateParams,
                    question: {
                        questionType: { equals: surveyType },
                    },
                },
            }),
            this.prisma.question.findMany({
                where: {
                    questionType: { equals: surveyType },
                },
                include: {
                    options: true,
                },
            }),
            this.prisma.surveyResponse.findMany({
                where: {
                    ...dateParams,
                    question: {
                        questionType: { equals: surveyType },
                    },
                },
                include: {
                    recipient: true,
                    question: {
                        include: {
                            survey: { include: { questions: true } },
                        },
                    },
                    options: { include: { option: true } },
                },
            }),
            this.prisma.survey.findMany({
                where: {
                    ...dateParams,
                    questionType: { equals: surveyType },
                },
                include: { questions: { include: { responses: true } } },
            }),
        ]);
        const [groupedResponsesByMonth, groupedPublishedSurveysByMonth] = await Promise.all([
            this.prisma.surveyResponse.groupBy({
                by: ["createdAt"],
                _count: true,
                where: {
                    ...dateParams,
                    question: { questionType: { equals: surveyType } },
                },
            }),
            this.prisma.survey.groupBy({
                by: ["createdAt"],
                _count: true,
                where: {
                    ...dateParams,
                    status: "PUBLISHED",
                    questionType: { equals: surveyType },
                },
            }),
        ]);
        const surveyTrendAnalysis = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            totalResponses: 0,
            totalPublished: 0,
        }));
        groupedResponsesByMonth.forEach((group) => {
            const month = new Date(group.createdAt).getMonth();
            surveyTrendAnalysis[month].totalResponses += group._count;
        });
        groupedPublishedSurveysByMonth.forEach((group) => {
            const month = new Date(group.createdAt).getMonth();
            surveyTrendAnalysis[month].totalPublished += group._count;
        });
        const [mobileUsersCount, webUsersCount] = await Promise.all([
            this.prisma.surveyResponse.count({
                where: {
                    ...dateParams,
                    question: { questionType: { equals: surveyType } },
                    recipient: { deviceType: "mobile" },
                },
            }),
            this.prisma.surveyResponse.count({
                where: {
                    ...dateParams,
                    question: { questionType: { equals: surveyType } },
                    recipient: { deviceType: "web" },
                },
            }),
        ]);
        const responseRateData = surveys.map((survey) => {
            const responses = survey.questions.map((question) => question.responses.every((response) => response.options?.length > 0));
            const totalResponses = responses.length;
            const completedCount = responses.filter(Boolean).length;
            const completedPercentage = (completedCount / totalResponses) * 100 || 0;
            const incompletedPercentage = 100 - completedPercentage;
            return {
                name: survey.heading,
                Completed: completedPercentage,
                Incompleted: incompletedPercentage,
            };
        });
        let publishedSurveys = 0, draftSurveys = 0, activeSurveys = 0, closedSurveys = 0;
        let hybridSurveys = 0, ordinalSurveys = 0, intervalSurveys = 0, ratioSurveys = 0;
        surveys.forEach((survey) => {
            switch (survey.status) {
                case "PUBLISHED":
                    publishedSurveys++;
                    break;
                case "DRAFT":
                    draftSurveys++;
                    break;
                case "ACTIVE":
                    activeSurveys++;
                    break;
                case "CLOSED":
                    closedSurveys++;
                    break;
            }
            switch (survey.questionType) {
                case "hybrid_survey":
                    hybridSurveys++;
                    break;
                case "interval_survey":
                    intervalSurveys++;
                    break;
                case "ordinal_survey":
                    ordinalSurveys++;
                    break;
                case "ratio_survey":
                    ratioSurveys++;
                    break;
            }
        });
        const percentageSurveyFor = (count) => count ? Math.round((count / surveys.length) * 100) : 0;
        const percentageActiveSurveys = percentageSurveyFor(activeSurveys);
        const percentageClosedSurveys = percentageSurveyFor(closedSurveys);
        const percentageOrdinalSurveys = percentageSurveyFor(ordinalSurveys);
        const percentageRatioSurveys = percentageSurveyFor(ratioSurveys);
        const percentageHybridSurveys = percentageSurveyFor(hybridSurveys);
        const percentageIntervalSurveys = percentageSurveyFor(intervalSurveys);
        let promoters = 0, passives = 0, detractors = 0;
        surveyResponses.forEach((response) => {
            const { question } = response;
            const { survey } = question;
            const handleNps = (score) => {
                if (score >= 9)
                    promoters++;
                else if (score >= 7)
                    passives++;
                else
                    detractors++;
            };
            if (question.nps && survey.questionType === "interval_survey") {
                response.options.forEach(({ option }) => {
                    handleNps(option.value);
                });
            }
            else if (question.nps && survey.questionType === "ordinal_survey") {
                response.options.forEach(({ option }) => {
                    const score = Number(option.value);
                    if (score >= 4)
                        promoters++;
                    else if (score === 3)
                        passives++;
                    else
                        detractors++;
                });
            }
        });
        const totalResponseCount = totalResponses.length;
        const percentageNpsFor = (count) => totalResponseCount ? Math.round((count / totalResponseCount) * 100) : 0;
        const percentagePromoters = percentageNpsFor(promoters);
        const percentagePassives = percentageNpsFor(passives);
        const percentageDetractors = percentageNpsFor(detractors);
        const nps = percentagePromoters - percentageDetractors;
        const percentageResponseRate = totalResponses.length
            ? Math.round(totalResponses.length / totalResponseCount)
            : 0;
        return {
            meta: {
                startDate: reportParam.startDate,
                endDate: reportParam.endDate,
                surveyType: reportParam.surveyType,
                percentageResponseRate,
                totalResponseCount,
                totalSurveys: surveys.length,
                mobile: mobileUsersCount,
                web: webUsersCount,
            },
            NpsAggregate: {
                promoters,
                passives,
                detractors,
                percentagePromoters,
                percentagePassives,
                percentageDetractors,
                nps,
            },
            surveyTrendAnalysis,
            responseRateData,
        };
    }
};
ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map