import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../shared/services/prisma.service";
import { MailGunService } from "../../shared/services/mailgun.service";
import moment from "moment";
import { Role } from "@prisma/client";

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private mailGunService: MailGunService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs every day at midnight
  async sendTrialNotifications() {
    const users = await this.prisma.user.findMany({
      where: {
        isTrialActive: true,
        trialStartDate: { not: null },
        role: Role.ADMIN,
      },
    });

    const today = moment();

    for (const user of users) {
      const trialEndDate = moment(user.trialStartDate).add(14, "days");
      const daysLeft = trialEndDate.diff(today, "days");

      if ([7, 3, 1].includes(daysLeft)) {
        await this.mailGunService.sendTrialEndingNotification(
          user.email,
          daysLeft,
        );
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs every day at midnight
  async subscriptionExpiringMail() {
    const today = moment();
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
              gte: moment().subtract(1, "month").toDate(),
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
        let expirationDate = moment(payment.createdAt)
          .add(1, "month")
          .startOf("day");
        let daysLeft = expirationDate.diff(today, "days");

        if ([7, 3, 1].includes(daysLeft)) {
          await this.mailGunService.sendEmailWithTemplate({
            to: user.email,
            subject:
              "Your Subscription is About to Expire – Don’t Lose Access!",
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async surveyCompletionMail() {
    const startOfToday = moment().startOf("day").toDate();
    const endOfToday = moment().endOf("day").toDate();

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

    const groupedByUser = Object.values(
      todaysResponses.reduce(
        (acc, response) => {
          const creatorId = response.question.survey.createdBy.id;

          if (!acc[creatorId]) {
            acc[creatorId] = {
              createdBy: response.question.survey.createdBy,
              responses: [],
            };
          }
          acc[creatorId].responses.push(response);
          return acc;
        },
        {} as Record<
          string,
          {
            createdBy: (typeof todaysResponses)[0]["question"]["survey"]["createdBy"];
            responses: typeof todaysResponses;
          }
        >,
      ),
    );

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
}
