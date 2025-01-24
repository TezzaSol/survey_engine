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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../shared/services/prisma.service");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
const moment_1 = __importDefault(require("moment"));
const client_1 = require("@prisma/client");
let NotificationService = class NotificationService {
    constructor(prisma, mailGunService) {
        this.prisma = prisma;
        this.mailGunService = mailGunService;
    }
    async sendTrialNotifications() {
        const users = await this.prisma.user.findMany({
            where: {
                isTrialActive: true,
                trialStartDate: { not: null },
                role: client_1.Role.ADMIN,
            },
        });
        const today = (0, moment_1.default)();
        for (const user of users) {
            const trialEndDate = (0, moment_1.default)(user.trialStartDate).add(14, "days");
            const daysLeft = trialEndDate.diff(today, "days");
            if ([7, 3, 1].includes(daysLeft)) {
                await this.mailGunService.sendTrialEndingNotification(user.email, daysLeft);
            }
            if (daysLeft <= 0 && user.isTrialActive == true) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        isTrialActive: false,
                    },
                });
                const subject = "Your Free Trial Has Ended – Upgrade to Continue!";
                const context = {
                    appName: process.env.APP_NAME,
                    user: user?.firstname,
                };
                this.mailGunService.sendEmailWithTemplate({
                    to: user.email,
                    subject,
                    templateName: "trial-expired",
                    context,
                });
            }
        }
    }
    async subscriptionExpiringMail() {
        const today = (0, moment_1.default)();
        const sevenDaysFromNow = today.clone().add(7, "days").startOf("day");
        const threeDaysFromNow = today.clone().add(3, "days").startOf("day");
        const oneDayFromNow = today.clone().add(1, "day").startOf("day");
        const users = await this.prisma.user.findMany({
            where: {
                payments: {
                    some: {
                        paymentStatus: "ACTIVE",
                        isActive: true,
                        createdAt: {
                            gte: (0, moment_1.default)().subtract(1, "month").toDate(),
                        },
                    },
                },
            },
            include: {
                payments: true,
            },
        });
        for (const user of users) {
            user.payments.forEach(async (payment) => {
                let expirationDate = (0, moment_1.default)(payment.createdAt)
                    .add(1, "month")
                    .startOf("day");
                let daysLeft = expirationDate.diff(today, "days");
                if ([7, 3, 1].includes(daysLeft)) {
                    await this.mailGunService.sendEmailWithTemplate({
                        to: user.email,
                        subject: "Your Subscription is About to Expire – Don’t Lose Access!",
                        templateName: "subscription-expiring-soon",
                        context: {
                            user: user?.firstname,
                            plan: payment.plan,
                            expirationDate: expirationDate,
                            appName: process.env.APP_NAME,
                        },
                    });
                }
                if (daysLeft <= 0 && payment.isActive == true) {
                    await this.prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            isActive: false,
                        },
                    });
                    const subject = "Your Subscription Has Expired";
                    const context = {
                        appName: process.env.APP_NAME,
                        user: user.firstname,
                        subscriptionUrl: `${process.env.WEBSITE_URL}`,
                    };
                    this.mailGunService.sendEmailWithTemplate({
                        to: user.email,
                        subject,
                        templateName: "subscription-expired",
                        context,
                    });
                }
            });
        }
    }
    async surveyCompletionMail() {
        const startOfToday = (0, moment_1.default)().startOf("day").toDate();
        const endOfToday = (0, moment_1.default)().endOf("day").toDate();
        const todaysResponses = await this.prisma.surveyResponse.findMany({
            distinct: "recipientId",
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                question: {
                    survey: {
                        createdBy: {
                            role: {
                                in: ["ADMIN", "TEAMMATE"],
                            },
                        },
                    },
                },
            },
            include: {
                question: {
                    include: {
                        survey: {
                            include: {
                                createdBy: true,
                            },
                        },
                    },
                },
            },
        });
        const groupedByUser = Object.values(todaysResponses.reduce((acc, response) => {
            const creatorId = response.question.survey.createdBy.id;
            if (!acc[creatorId]) {
                acc[creatorId] = {
                    createdBy: response.question.survey.createdBy,
                    responses: [],
                };
            }
            acc[creatorId].responses.push(response);
            return acc;
        }, {}));
        if (groupedByUser.length > 0) {
            groupedByUser.forEach((entry) => {
                this.mailGunService.sendEmailWithTemplate({
                    to: entry.createdBy.email,
                    subject: `Today’s Survey Summary – ${entry.responses.length} People Completed Your Survey!`,
                    templateName: "daily-survey-completion",
                    context: {
                        user: entry.createdBy?.firstname,
                        surveyCount: entry.responses.length,
                        appName: process.env.APP_NAME,
                    },
                });
            });
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "sendTrialNotifications", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "subscriptionExpiringMail", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "surveyCompletionMail", null);
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailGunService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map