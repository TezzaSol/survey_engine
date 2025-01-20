import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { FilterSurveysDto } from "./dto/filter-surveys.dto";
import { SurveyStatus, SurveyQuestionType } from "@prisma/client";

export interface ReportParam {
  startDate?: string;
  endDate?: string;
  surveyType?: string;
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSurveyStatistics(filterSurveysDto: FilterSurveysDto) {
    const { startDate, endDate, status, surveyTemplate } = filterSurveysDto;

    const where: any = {};

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

    // if (surveyTemplate && surveyTemplate.length > 0) {
    //   where.id = { in: surveyTemplate };
    // }

    const surveys = await this.prisma.survey.findMany({
      where,
      include: { questions: { include: { responses: true } } },
    });

    const totalSurveysSent = surveys.length;
    const totalSurveysDraft = surveys.filter(
      (s) => s.status === SurveyStatus.DRAFT
    ).length;
    const totalSurveysPublished = surveys.filter(
      (s) => s.status === SurveyStatus.PUBLISHED
    ).length;
    const totalSurveysActive = surveys.filter(
      (s) => s.status === SurveyStatus.ACTIVE
    ).length;
    const totalSurveysClosed = surveys.filter(
      (s) => s.status === SurveyStatus.CLOSED
    ).length;

    const totalResponses = surveys.reduce((acc, survey) => {
      return (
        acc +
        survey.questions.reduce(
          (qAcc, question) => qAcc + question.responses.length,
          0
        )
      );
    }, 0);

    // const averageCompletionRate =
    //   surveys.reduce((acc, survey) => acc + (survey.responses || 0), 0) /
    //   (totalSurveysSent || 1);

    const responseRate = (totalResponses / (totalSurveysSent || 1)) * 100;

    return {
      data: {
        totalSurveysSent,
        totalSurveysDraft,
        totalSurveysPublished,
        totalSurveysActive,
        totalSurveysClosed,
        totalResponses,
        //averageCompletionRate,
        responseRate,
      },
    };
  }

  async reports(userId: string, reportParam: ReportParam) {
    const dateParams: object = {
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

    const queryByRole = async (role: string) => {
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
          // same as above
          break;
        case "TEAMMATE":
          return { createdById: userId };
      }
    };

    const filterByUserRole = await queryByRole(currentUser.role);

    // Additional query to get total surveys sent with status PUBLISHED
    const totalSurveySent1 = await this.prisma.survey.count({
      where: {
        ...dateParams,
        status: "PUBLISHED",
        questionType: {
          equals: SurveyQuestionType[reportParam.surveyType],
        },
        ...filterByUserRole,
      },
    });

    // DB Queries
    // total recipient survey was sent to
    const totalResponses = await this.prisma.surveyResponse.findMany({
      distinct: "recipientId",
      where: {
        ...dateParams,
        question: {
          questionType: {
            equals: SurveyQuestionType[reportParam.surveyType],
          },
          // survey: {
          //   createdById: userId,
          // },
          survey: { ...filterByUserRole },
        },
      },
    });

    const surveyResponseQuery = async () =>
      await this.prisma.surveyResponse.findMany({
        where: {
          ...dateParams,
          question: {
            questionType: {
              equals: SurveyQuestionType[reportParam.surveyType],
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
          equals: SurveyQuestionType[reportParam.surveyType],
        },
        ...filterByUserRole,
      },
      include: { questions: { include: { responses: true } } },
    });

    // console.log(surveys);

    // // Step 2: Grouping totalResponses and totalPublished surveys by month
    // const groupedResponsesByMonth = await this.prisma.surveyResponse.groupBy({
    //   by: ["createdAt"],
    //   _count: true,
    //   where: {
    //     ...dateParams,
    //     question: {
    //       questionType: {
    //         equals: SurveyQuestionType[reportParam.surveyType],
    //       },
    //       survey: {
    //         ...filterByUserRole,
    //       },
    //     },
    //   },
    // });

    // const groupedPublishedSurveysByMonth = await this.prisma.survey.groupBy({
    //   by: ["createdAt"],
    //   _count: true,
    //   where: {
    //     ...dateParams,
    //     status: "PUBLISHED",
    //     questionType: {
    //       equals: SurveyQuestionType[reportParam.surveyType],
    //     },
    //     ...filterByUserRole,
    //   },
    // });

    // // Step 3: Calculate the totals for each month
    // const surveyTrendAnalysis = Array.from({ length: 12 }, (_, index) => ({
    //   month: index + 1,
    //   totalResponses: 0,
    //   totalPublished: 0,
    // }));

    // groupedResponsesByMonth.forEach((group) => {
    //   const month = new Date(group.createdAt).getMonth();
    //   surveyTrendAnalysis[month].totalResponses += group._count;
    // });

    // groupedPublishedSurveysByMonth.forEach((group) => {
    //   const month = new Date(group.createdAt).getMonth();
    //   surveyTrendAnalysis[month].totalPublished += group._count;
    // });


    // Helper function to extract year-month as a key
const getYearMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`;

// Step 1: Fetch distinct responses by recipientId
const distinctResponses = await this.prisma.surveyResponse.findMany({
  distinct: "recipientId",
  where: {
    ...dateParams,
    question: {
      questionType: { equals: SurveyQuestionType[reportParam.surveyType] },
      survey: { ...filterByUserRole },
    },
  },
  select: {
    createdAt: true,
  },
});

// Step 2: Fetch published surveys grouped by day
const groupedPublishedSurveysByDay = await this.prisma.survey.groupBy({
  by: ["createdAt"],
  _count: true,
  where: {
    ...dateParams,
    status: "PUBLISHED",
    questionType: {
      equals: SurveyQuestionType[reportParam.surveyType],
    },
    ...filterByUserRole,
  },
});

// Step 3: Initialize surveyTrendAnalysis with 12 months
const surveyTrendAnalysis = Array.from({ length: 12 }, (_, index) => ({
  month: index + 1,
  totalResponses: 0,
  totalPublished: 0,
}));

// Step 4: Aggregate distinct responses by month
const monthlyResponseCounts: Record<string, number> = {};
distinctResponses.forEach((response) => {
  const monthKey = getYearMonthKey(new Date(response.createdAt));
  monthlyResponseCounts[monthKey] = (monthlyResponseCounts[monthKey] || 0) + 1;
});

// Step 5: Aggregate published surveys by month
const monthlyPublishedCounts: Record<string, number> = {};
groupedPublishedSurveysByDay.forEach((group) => {
  const monthKey = getYearMonthKey(new Date(group.createdAt));
  monthlyPublishedCounts[monthKey] = (monthlyPublishedCounts[monthKey] || 0) + group._count;
});

// Step 6: Populate surveyTrendAnalysis with monthly totals
const currentYear = new Date().getFullYear(); // Adjust if needed
surveyTrendAnalysis.forEach((entry) => {
  const monthKey = `${currentYear}-${entry.month}`;
  entry.totalResponses = monthlyResponseCounts[monthKey] || 0;
  entry.totalPublished = monthlyPublishedCounts[monthKey] || 0;
});


    // Device type calculations
    const mobileUsersCount = await this.prisma.surveyResponse.count({
      where: {
        ...dateParams,
        question: {
          questionType: {
            equals: SurveyQuestionType[reportParam.surveyType],
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
            equals: SurveyQuestionType[reportParam.surveyType],
          },
          survey: { ...filterByUserRole },
        },
        recipient: {
          deviceType: "web",
        },
      },
    });

    // Response rate calculation for each survey the last 6 surveys

    const responseRateData = surveys
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6) // Limit to the latest 6 surveys
      .map((survey) => {
        const responses = survey.questions.map((question) =>
          question.responses.every(
            (response) => (response as any).options?.length > 0
          )
        );

        const totalResponses = responses.length;
        const completedCount = responses.filter(Boolean).length;
        const completedPercentage =
          (completedCount / totalResponses) * 100 || 0;
        const incompletedPercentage = 100 - completedPercentage;

        return {
          name: survey.heading,
          Completed: Math.round(completedPercentage),
          Incompleted: Math.round(incompletedPercentage),
        };
      });

    //////////

    // Surveys stats
    const totalSurveys = surveys.length;
    let publishedSurveys: number = 0;
    let draftSurveys: number = 0;
    let activeSurveys: number = 0;
    let closedSurveys: number = 0;

    let hybridSurveys: number = 0;
    let ordinalSurveys: number = 0;
    let intervalSurveys: number = 0;
    let ratioSurveys: number = 0;

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

    const percentageSurveyFor = (count: number) =>
      count > 0 ? Math.round((count / totalSurveys) * 100) : 0;

    const percentageActiveSurveys = percentageSurveyFor(activeSurveys);
    const percentageClosedSurveys = percentageSurveyFor(closedSurveys);
    const percentageOrdinalSurveys = percentageSurveyFor(ordinalSurveys);
    const percentageRatioSurveys = percentageSurveyFor(ratioSurveys);
    const percentageHybridSurveys = percentageSurveyFor(hybridSurveys);
    const percentageIntervalSurveys = percentageSurveyFor(intervalSurveys);

    // Calculate promoters, passives, detractors
    let promoters: number = 0;
    let passives: number = 0;
    let detractors: number = 0;

    function npsHandler(score) {
      if (score >= 9) {
        promoters += 1;
      } else if (score >= 7) {
        passives += 1;
      } else {
        detractors += 1;
      }
    }

    function ordinalNpsHandler(score) {
      if (score >= 4) {
        promoters += 1;
      } else if (score == 3) {
        passives += 1;
      } else {
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
        const monthYear = survey.createdAt.toISOString().slice(0, 7); // Format: YYYY-MM

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
            } else if (maxScore >= 7) {
              monthlyAggregates[monthYear]["passives"] += 1;
            } else {
              monthlyAggregates[monthYear]["detractors"] += 1;
            }
          });
          monthlyAggregates[monthYear]["recipientSet"].add(survey.recipient.id);
        }
      });

      // Calculate NPS for each month
      return Object.values(monthlyAggregates)
        .map((monthData) => {
          const totalResponses = monthData["recipientSet"].size || 1;
          const percentagePromoters = Math.round(
            (monthData["promoters"] / totalResponses) * 100,
          );
          const percentageDetractors = Math.round(
            (monthData["detractors"] / totalResponses) * 100,
          );
          const percentagePassives = Math.round(
            (monthData["passives"] / totalResponses) * 100,
          );

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
          return (
            new Date(`${b.year}-${b.month}`).getTime() -
            new Date(`${a.year}-${a.month}`).getTime()
          );
        });
    };

    const surveysNpsList = async () => {
      const groupedBySurveyId = surveyResponses.reduce((acc, response) => {
        const surveyId = response.question.surveyId;
        let question = response.question;
        let surveyQType = question.survey.questionType;
        let title = question.survey.heading;
        let publishedAt = response.question.survey?.publishedAt;

        // Initialize the survey group if it doesn't exist
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
            } else if (maxScore >= 7) {
              acc[surveyId].passives += 1;
            } else {
              acc[surveyId].detractors += 1;
            }
          });
        }

        return acc;
      }, {});

      // calculate sent count
      const recipientCounter = async (lists) =>
        await this.prisma.recipient.groupBy({
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

      // Calculate NPS score for each survey group
      const groupSurveys = await Promise.all(
        Object.values(groupedBySurveyId).map(async (group: object) => {
          const totalResponses =
            group["promoters"] + group["passives"] + group["detractors"];

          // calculate sent
          const listIds = group["responses"].map(
            (response) => response.recipient.listId,
          );
          const uniqueListIds = [...new Set(listIds)];
          const recipientCounts = await recipientCounter(uniqueListIds); // = async () => {

          const groupSurveySent = recipientCounts.reduce(
            (sum, count) => sum + count._count.id,
            0,
          );

          const percentageNpsFor = (count: number) =>
            count > 0 ? Math.round((count / totalResponses) * 100) : 0;

          if (totalResponses > 0) {
            group["nps"] =
              ((group["promoters"] - group["detractors"]) / totalResponses) *
              100;
          }
          group["percentageResponseRate"] = Math.round(
            (totalResponses / groupSurveySent) * 100,
          );

          group["percentagePromoters"] = percentageNpsFor(group["promoters"]);
          group["percentagePassives"] = percentageNpsFor(group["passives"]);
          group["percentageDetractors"] = percentageNpsFor(group["detractors"]);
          group["percentageNps"] =
            group["percentagePromoters"] - group["percentageDetractors"];

          return group;
        }),
      );

      // delete the responses key
      groupSurveys.map((obj) => delete obj["responses"]);

      return groupSurveys.sort(
        (a, b) => b["percentageResponseRate"] - a["percentageResponseRate"]
      );
    };

    const recipientIds = totalResponses.map((response) => response.recipientId);
    const uniqueRecipientIds = [...new Set(recipientIds)];
    const distinctRecipientCount = uniqueRecipientIds.length;

    const listIds = surveyResponses.map(
      (response) => response.recipient.listId
    );
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

    const totalSurveySent = recipientCounts.reduce(
      (sum, count) => sum + count._count.id,
      0
    );

    // NPS calculation
    const totalResponseCount = totalResponses.length;
    const percentageNpsFor = (count: number) =>
      count > 0 ? Math.round((count / totalResponseCount) * 100) : 0;

    const percentagePromoters = percentageNpsFor(promoters);
    const percentageDetractors = percentageNpsFor(detractors);
    const percentagePassives = percentageNpsFor(passives);
    const nps = percentagePromoters - percentageDetractors;

    const percentageResponseRate =
      totalResponseCount > 0
        ? Math.round((totalResponseCount / totalSurveySent) * 100)
        : 0;

    ////////////////////////////////

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
      surveyTrendAnalysis, // Include the monthly data in the result
      responseRateData, // Add the new completion/incompletion data
    };
  }

  async reportsOptimized(reportParam: ReportParam, deviceType) {
    const dateParams: object = {
      createdAt: {
        gte: reportParam.startDate
          ? new Date(reportParam.startDate)
          : undefined,
        lte: reportParam.endDate ? new Date(reportParam.endDate) : undefined,
      },
    };

    // Store survey type for reuse
    const surveyType = SurveyQuestionType[reportParam.surveyType];

    // Fetch total responses, questions, surveys, and survey responses in parallel
    const [totalResponses, questions, surveyResponses, surveys] =
      await Promise.all([
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

    // Group responses and published surveys by month
    const [groupedResponsesByMonth, groupedPublishedSurveysByMonth] =
      await Promise.all([
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

    // Initialize survey trend analysis array for 12 months
    const surveyTrendAnalysis = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalResponses: 0,
      totalPublished: 0,
    }));

    // Populate survey trend analysis
    groupedResponsesByMonth.forEach((group) => {
      const month = new Date(group.createdAt).getMonth();
      surveyTrendAnalysis[month].totalResponses += group._count;
    });
    groupedPublishedSurveysByMonth.forEach((group) => {
      const month = new Date(group.createdAt).getMonth();
      surveyTrendAnalysis[month].totalPublished += group._count;
    });

    // Fetch device type counts in parallel
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

    // Response rate calculation for each survey
    const responseRateData = surveys.map((survey) => {
      const responses = survey.questions.map((question) =>
       // question.responses.every((response) => response.options?.length > 0)
      question.responses.every((response) => (response as any).options?.length > 0)

      );

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

    // Survey statistics
    let publishedSurveys = 0,
      draftSurveys = 0,
      activeSurveys = 0,
      closedSurveys = 0;
    let hybridSurveys = 0,
      ordinalSurveys = 0,
      intervalSurveys = 0,
      ratioSurveys = 0;

    surveys.forEach((survey) => {
      // Count survey statuses
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
      // Count survey types
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

    const percentageSurveyFor = (count) =>
      count ? Math.round((count / surveys.length) * 100) : 0;

    const percentageActiveSurveys = percentageSurveyFor(activeSurveys);
    const percentageClosedSurveys = percentageSurveyFor(closedSurveys);
    const percentageOrdinalSurveys = percentageSurveyFor(ordinalSurveys);
    const percentageRatioSurveys = percentageSurveyFor(ratioSurveys);
    const percentageHybridSurveys = percentageSurveyFor(hybridSurveys);
    const percentageIntervalSurveys = percentageSurveyFor(intervalSurveys);

    // Calculate NPS
    let promoters = 0,
      passives = 0,
      detractors = 0;

    surveyResponses.forEach((response) => {
      const { question } = response;
      const { survey } = question;

      const handleNps = (score) => {
        if (score >= 9) promoters++;
        else if (score >= 7) passives++;
        else detractors++;
      };

      if (question.nps && survey.questionType === "interval_survey") {
        response.options.forEach(({ option }) => {
          handleNps(option.value);
        });
      } else if (question.nps && survey.questionType === "ordinal_survey") {
        response.options.forEach(({ option }) => {
          const score = Number(option.value);
          if (score >= 4) promoters++;
          else if (score === 3) passives++;
          else detractors++;
        });
      }
    });

    // NPS calculations
    const totalResponseCount = totalResponses.length;
    const percentageNpsFor = (count) =>
      totalResponseCount ? Math.round((count / totalResponseCount) * 100) : 0;

    const percentagePromoters = percentageNpsFor(promoters);
    const percentagePassives = percentageNpsFor(passives);
    const percentageDetractors = percentageNpsFor(detractors);
    const nps = percentagePromoters - percentageDetractors;

    const percentageResponseRate = totalResponses.length
      ? Math.round(totalResponses.length / totalResponseCount)
      : 0;

    // Return the final report data
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

}