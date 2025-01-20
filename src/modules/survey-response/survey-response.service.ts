
import { Injectable, ConflictException } from "@nestjs/common";
import { SurveyResponseRepository } from "./survey-response.repository";
import { CreateSurveyResponseDto } from "./dto/create-survey-response.dto";
import { CreateSurveyResponsesDto } from "./dto/create-survey-responses.dto";
import { PrismaService } from "../../shared/services/prisma.service";
import { PageParams, PagedResponse } from "src/shared/interfaces";
import { SurveyQuestionType } from "@prisma/client";

@Injectable()
export class SurveyResponseService {
  constructor(
    private prisma: PrismaService,
    private readonly surveyResponseRepository: SurveyResponseRepository
  ) {}

  async createResponses(deviceType: string, dto: CreateSurveyResponsesDto) {
    const recipient = await this.surveyResponseRepository.findRecipientById(
      dto.recipientId
    );

    if (!recipient) {
      throw new ConflictException("Recipient not found");
    }

    const alreadyFilled = await this.surveyResponseRepository.hasFilledSurvey(
      recipient.id,
      dto.surveyId
    );

    if (alreadyFilled) {
      throw new ConflictException(
        "This survey has already been filled by this recipient."
      );
    }

    const responsesToCreate: CreateSurveyResponseDto[] = dto.responses.map(
      (response) => ({
        ...response,
        recipientId: recipient.id,
      })
    );

    return this.surveyResponseRepository.createResponses(
      deviceType,
      responsesToCreate
    );
  }

  async getAllSurveyResponses() {
    return this.prisma.surveyResponse.findMany({
      include: {
        question: true, // Include the related question
        options: {
          // Include the related options (answers)
          include: {
            option: true, // Include the option details for each response
          },
        },
        recipient: true, // Optionally include recipient details
      },
    });
  }

  async getRecipientDataAndResponses(recipientId: string) {
    return this.prisma.recipient.findUnique({
      where: { id: recipientId },
      include: {
        surveyResponses: {
          include: {
            question: true,
            options: true,
          },
        },
      },
    });
  }

  async getSurveyWithResponsesBK(surveyId: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: {
            responses: {
              include: {
                recipient: true,
                options: {
                  include: {
                    option: true, // Include the related Option data
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!survey) {
      throw new Error("Survey not found");
    }

    const totalResponses = survey.questions.reduce(
      (acc, question) => acc + question.responses.length,
      0
    );

    const totalSurveySent = 0 //survey.responses || 0;
    const completionRate =
      totalSurveySent > 0 ? (totalResponses / totalSurveySent) * 100 : 0;

    const transformedData = {
      totalResponse: totalResponses,
      totalSurveySent,
      completionRate: `${Math.round(completionRate)}%`,
      surveyStatus: survey.status,
      question: survey.questions.map((q) => q.question),
      responses: [],
    };

    const recipientsMap = new Map();

    survey.questions.forEach((question) => {
      question.responses.forEach((response) => {
        if (!recipientsMap.has(response.recipient.id)) {
          recipientsMap.set(response.recipient.id, {
            id: recipientsMap.size + 1,
            firstname: response.recipient.firstname,
            lastname: response.recipient.lastname,
            createdAt: response.createdAt,
            answer: new Array(survey.questions.length).fill([]),
          });
        }
        const recipientData = recipientsMap.get(response.recipient.id);
        const questionIndex = survey.questions.findIndex(
          (q) => q.id === response.questionId
        );
        const optionLabels = response.options.map(
          (option) => option.option.label
        );
        recipientData.answer[questionIndex] = optionLabels;
      });
    });

    transformedData.responses = Array.from(recipientsMap.values());

    return transformedData;
  }

  async getSurveyWithResponsesWK(surveyId: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: {
            responses: {
              include: {
                recipient: true,
                options: {
                  include: {
                    option: true, // Include the related Option data
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!survey) {
      throw new Error("Survey not found");
    }

    const totalResponses = survey.questions.reduce(
      (acc, question) => acc + question.responses.length,
      0
    );

    const totalSurveySent = 0 //survey.responses || 0;
    const completionRate =
      totalSurveySent > 0 ? (totalResponses / totalSurveySent) * 100 : 0;

    const transformedData = {
      totalResponse: totalResponses,
      totalSurveySent,
      completionRate: `${Math.round(completionRate)}%`,
      surveyStatus: survey.status,
      questions: survey.questions.map((q) => q.question),
      responses: [],
    };

    const recipientsMap = new Map();

    survey.questions.forEach((question) => {
      question.responses.forEach((response) => {
        if (!recipientsMap.has(response.recipient.id)) {
          recipientsMap.set(response.recipient.id, {
            id: recipientsMap.size + 1,
            firstname: response.recipient.firstname,
            lastname: response.recipient.lastname,
            createdAt: response.createdAt,
            answer: new Array(survey.questions.length).fill([]),
            responseIds: [], // Initialize responseIds array
          });
        }
        const recipientData = recipientsMap.get(response.recipient.id);
        const questionIndex = survey.questions.findIndex(
          (q) => q.id === response.questionId
        );
        const optionLabels = response.options.map(
          (option) => option.option.label
        );
        recipientData.answer[questionIndex] = optionLabels;
        recipientData.responseIds.push(response.id); // Add response id to the array
      });
    });

    transformedData.responses = Array.from(recipientsMap.values());

    return transformedData;
  }

  async fetchSurveyResponses(
    filterBySurveyId: any,
    distinct?: any[],
    take?: number,
    skip?: number
  ) {
    return this.prisma.surveyResponse.findMany({
      distinct,
      take,
      skip,
      where: { ...filterBySurveyId },

      select: {
        id: true,
        recipientId: true,
        recipient: {
          select: {
            firstname: true,
            lastname: true,
            phoneNumber: true,
            email: true,
            listId: true,
          },
        },
        options: {
          select: {
            option: {
              select: {
                value: true,
                label: true,
                question: {
                  select: {
                    question: true,
                    questionType: true,
                  },
                },
              },
            },
          },
        },
      },
      // orderBy: sortBy ? { [sortBy]: sortDir } : undefined,
    });
  }

  async getSurveyWithResponses(surveyId: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: {
            responses: {
              include: {
                recipient: true,
                options: {
                  include: {
                    option: true, // Include the related Option data
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!survey) {
      throw new Error("Survey not found");
    }
    ///////////////////////

    const filterBySurveyId = {
      question: {
        surveyId: surveyId,
      },
    };

    const responses = await this.fetchSurveyResponses(
      filterBySurveyId,
      undefined
    );

    const responsesCount = await this.fetchSurveyResponses(filterBySurveyId, [
      "recipientId",
    ]);
    // return responsesCount.length;

    const recipientIds = responsesCount.map((response) => response.recipientId);
    const uniqueRecipientIds = [...new Set(recipientIds)];
    const distinctRecipientCount = uniqueRecipientIds.length;

    const listIds = responses.map((response) => response.recipient.listId);
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
      0,
    );

    let completed = (100 * distinctRecipientCount) / totalSurveySent;
    let percentageCompletion = Math.round(completed) || 0;
    ////////////////////////////
    // const totalResponses = survey.questions.reduce(
    //   (acc, question) => acc + question.responses.length,
    //   0,
    // );

    // const totalSurveySent = survey.responses || 0;
    // const completionRate =
    //   totalSurveySent > 0 ? (totalResponses / totalSurveySent) * 100 : 0;

    const transformedData = {
      totalResponse: distinctRecipientCount, //totalResponses,
      totalSurveySent: totalSurveySent,
      completionRate: `${Math.round(percentageCompletion)}%`,
      surveyStatus: survey.status,
      questions: survey.questions.map((q) => q.question),
      responses: [],
    };

    const recipientsMap = new Map();

    survey.questions.forEach((question) => {
      question.responses.forEach((response) => {
        if (!recipientsMap.has(response.recipient.id)) {
          recipientsMap.set(response.recipient.id, {
            id: response.recipient.id, // Use recipient.id instead of recipientsMap.size + 1
            firstname: response.recipient.firstname,
            lastname: response.recipient.lastname,
            createdAt: response.createdAt,
            answer: new Array(survey.questions.length).fill([]),
            responseIds: [], // Initialize responseIds array
          });
        }
        const recipientData = recipientsMap.get(response.recipient.id);
        const questionIndex = survey.questions.findIndex(
          (q) => q.id === response.questionId
        );
        const optionLabels = response.options.map(
          (option) => option.option.label
        );
        recipientData.answer[questionIndex] = optionLabels;
        recipientData.responseIds.push(response.id); // Add response id to the array
      });
    });

    transformedData.responses = Array.from(recipientsMap.values());

    return transformedData;
  }

  async deleteRecipientResponses(recipientId: string, responseIds?: string[]) {
    if (responseIds && responseIds.length > 0) {
      return this.prisma.surveyResponse.deleteMany({
        where: {
          id: { in: responseIds },
          recipientId: recipientId,
        },
      });
    }
    return this.prisma.surveyResponse.deleteMany({
      where: { recipientId: recipientId },
    });
  }

  async deleteRecipientsResponses(recipientId: string, responseIds: string[]) {
    return this.surveyResponseRepository.deleteResponses(
      recipientId,
      responseIds
    );
  }

  async deleteResponsesForRecipients(
    recipientData: { recipientId: string; responseIds: string[] }[]
  ) {
    return this.prisma.$transaction(async () => {
      for (const { recipientId, responseIds } of recipientData) {
        if (responseIds && responseIds.length > 0) {
          await this.surveyResponseRepository.deleteResponses(
            recipientId,
            responseIds
          );
        } else {
          await this.surveyResponseRepository.deleteAllResponses(recipientId);
        }
      }
    });
  }

  async analyzeResponses(surveyId: string) {
    const filterBySurveyId = {
      question: {
        surveyId: surveyId,
      },
    };
    const questions = await this.prisma.question.findMany({
      where: {
        surveyId: surveyId,
      },
      include: {
        options: true,
      },
    });

    const surveyResponses = await this.prisma.surveyResponse.findMany({
      where: { ...filterBySurveyId },
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

    // Calculate promoters, passives, detractors
    let promoters = 0;
    let passives = 0;
    let detractors = 0;

    function npsHandler(score) {
      if (score >= 9) {
        promoters += 1;
      } else if (score >= 7) {
        passives += 1;
      } else {
        detractors += 1;
      }
    }

    surveyResponses.forEach((response) => {
      let question = response.question;
      let surveyQuestionType = question.survey.questionType;

      if (surveyQuestionType == SurveyQuestionType.nps_survey) {
        response.options.forEach((responseOption) => {
          let score = responseOption?.option?.value;
          let maxScore = score[Object.keys(score).length - 1];
          npsHandler(maxScore);
        });
      }
    });

    const questionAnswerGroups = surveyResponses.reduce((acc, response) => {
      const questionId = response.question.id;
      const questionText = response.question.question;
      const questionType = response.question.questionType;
      const nps = response.question.nps;

      if (!acc[questionId]) {
        acc[questionId] = {
          question: questionText,
          questionType: questionType,
          totalRecipients: new Set(),
          nps: nps,
          answers: {},
        };
      }

      acc[questionId].totalRecipients.add(response.recipientId);

      response.options.forEach((responseOption) => {
        const answer = JSON.stringify(responseOption.option.value);

        if (!acc[questionId].answers[answer]) {
          acc[questionId].answers[answer] = {
            answer: responseOption.option.value,
            label: responseOption.option.label,
            recipients: new Set(),
          };
        }

        acc[questionId].answers[answer].recipients.add(response.recipientId);
      });

      return acc;
    }, {});

    questions.forEach((question) => {
      if (!questionAnswerGroups[question.id]) {
        questionAnswerGroups[question.id] = {
          question: question.question,
          questionType: question.questionType,
          nps: question.nps,
          answers: {},
        };
      }

      question.options.forEach((option) => {
        const answer = JSON.stringify(option.value);

        if (!questionAnswerGroups[question.id].answers[answer]) {
          questionAnswerGroups[question.id].answers[answer] = {
            answer: option.value,
            label: option.label,
            recipients: new Set(),
          };
        }
      });
    });

    const totalResponses = await this.prisma.surveyResponse.findMany({
      distinct: "recipientId",
      where: { ...filterBySurveyId },
    });

    const analysisResult = Object.entries(questionAnswerGroups).map(
      ([questionId, group]) => {
        const totalRecipientsCount = group["totalRecipients"]?.size;
        const answers = Object.values(group["answers"]).map((answerGroup) => ({
          answer: answerGroup["answer"],
          label: answerGroup["label"],
          recipientCount: answerGroup["recipients"].size,
          percentageCompletion:
            totalRecipientsCount === 0
              ? 0
              : Math.round(
                  (answerGroup["recipients"].size / totalRecipientsCount) * 100
                ),
        }));

        return {
          questionId,
          question: group["question"],
          nps: group["nps"],
          questionType: group["questionType"],
          answers,
        };
      }
    );

    // total recipient survey was sent to
    const responsesCount = await this.prisma.surveyResponse.findMany({
      distinct: ["recipientId"],
      where: { ...filterBySurveyId },
    });

    const recipientIds = responsesCount.map((response) => response.recipientId);
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
    let percentagePromoters = 0;
    let percentageDetractors = 0;
    let percentagePassives = 0;
    let nps = 0;
    let percentageResponseRate = 0;

    percentagePromoters =
      promoters > 0 ? Math.round((promoters / totalResponseCount) * 100) : 0;
    percentageDetractors =
      detractors > 0 ? Math.round((detractors / totalResponseCount) * 100) : 0;
    percentagePassives =
      passives > 0 ? Math.round((passives / totalResponseCount) * 100) : 0;
    nps = percentagePromoters - percentageDetractors;
    percentageResponseRate =
      totalResponseCount > 0
        ? Math.round((totalResponseCount / totalSurveySent) * 100)
        : 0;

    return {
      meta: {
        promoters,
        passives,
        detractors,
        percentagePromoters,
        percentageDetractors,
        percentagePassives,
        nps,
        percentageResponseRate,
        totalResponseCount,
      },
      data: analysisResult,
    };
  }

  async getResponses(
    surveyId: string,
    params: PageParams
  ): Promise<PagedResponse> {
    const filterBySurveyId = {
      question: {
        surveyId: surveyId,
      },
    };

    const responsesCount = await this.prisma.surveyResponse.findMany({
      distinct: ["recipientId"],
      where: { ...filterBySurveyId },
    });

    // set defaults
    let sortBy = params.sortBy || "id";
    let sortDir = params.sortDir || "desc";
    let pageSize = Number(params.pageSize) || 10;
    let pageNumber = Number(params.pageNumber) || 1;
    let skip = Number((pageNumber - 1) * pageSize);
    let take = Number(pageSize + 1);

    const responses = await this.prisma.surveyResponse.findMany({
      // distinct: ["recipientId"],
      // take,
      // skip,
      where: { ...filterBySurveyId },

      select: {
        id: true,
        recipientId: true,
        recipient: {
          select: {
            firstname: true,
            lastname: true,
            phoneNumber: true,
            email: true,
            listId: true,
          },
        },
        options: {
          select: {
            option: {
              select: {
                value: true,
                label: true,
                question: {
                  select: {
                    question: true,
                    questionType: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: sortBy ? { [sortBy]: sortDir } : undefined,
    });

    let groupedResponses = responses.reduce((acc, record) => {
      if (!acc[record.recipientId]) {
        acc[record.recipientId] = {
          recipientId: record.recipientId,
          recipient: record.recipient,
          options: [],
        };
      }
      acc[record.recipientId].options.push(...record.options);
      return acc;
    }, {});

    let surveyResponses = Object.values(groupedResponses);
    const hasNextPage = surveyResponses.length > pageSize;
    const edges = hasNextPage
      ? surveyResponses.slice(0, pageSize)
      : surveyResponses;

    const recipientIds = responsesCount.map((response) => response.recipientId);
    const uniqueRecipientIds = [...new Set(recipientIds)];
    const distinctRecipientCount = uniqueRecipientIds.length;

    const listIds = responses.map((response) => response.recipient.listId);
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

    let completed = (100 * distinctRecipientCount) / totalSurveySent;
    let percentageCompletion = Math.round(completed) || 0;

    return {
      meta: {
        q: params.q,
        startDate: params.startDate,
        endDate: params.endDate,
        sortBy,
        sortDir,
        pageSize,
        pageNumber,
        hasNextPage: hasNextPage,
        totalSurveysSent: totalSurveySent,
        totalResponded: distinctRecipientCount,
        percentageCompletion: percentageCompletion,
        endCursor: hasNextPage ? edges[pageSize - 1]["recipientId"] : null,
        totalPages: Math.ceil(distinctRecipientCount / pageSize),
        totalItems: responsesCount?.length,
      },
      data: surveyResponses,
    };
  }
}
