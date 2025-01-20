import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { CreateSurveyDto } from "./dtos/create-survey.dto";
import { ResponseData } from "../../../src/shared/interfaces";
import { Utils } from "../../../src/shared/utils";
import { UpdateSurveyDto } from "./dtos/update-survey.dto";
import { UpdateSurveyStatus } from "./dtos/update-survey-status.dto";
import { MailGunService } from "../../shared/services/mailgun.service";

export interface SurveyQuery {
  q?: string;
  search?: string;
  pageNumber?: number | 1;
  pageSize?: number | 10;
  sortBy?: string;
  sortDir?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class SurveyService {
  constructor(
    private prisma: PrismaService,
    private mailGunService: MailGunService
  ) {}

  async createSurvey(
    data: CreateSurveyDto,
    userId: string
  ): Promise<ResponseData> {
    try {
      // Fetch the user's subscription plan and the number of surveys they have created
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          surveys: true, // Include surveys to count them later
        },
      });

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      if (user && user.role == "OBSERVER") {
        return { message: "Forbidden, Not authorized" };
      }

      // Check if the user is on the BASIC plan
      // if (user.subscriptionPlan === "BASIC") {
      //   const surveyCount = user.surveys.length;

      //   // If the user already has 5 surveys, prevent them from creating more
      //   if (surveyCount >= 5) {
      //     throw new HttpException(
      //       "You have reached the survey limit for the BASIC plan. Please upgrade to create more surveys.",
      //       HttpStatus.FORBIDDEN
      //     );
      //   }
      // }

      //Check if the user is on the BASIC plan and has reached the survey limit
      if (user.subscriptionPlan === "BASIC" && user.surveyCount >= 5) {
        throw new HttpException(
          "You have reached the survey limit for the BASIC plan. Please upgrade to create more surveys.",
          HttpStatus.FORBIDDEN
        );
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

      // survey crea
      await this.mailGunService.sendEmailWithTemplate({
        to: user.email,
        subject,
        templateName,
        context,
      });
      // Update the survey to store the publishUrl
      const updatedSurvey = await this.prisma.survey.update({
        where: { id: createSurvey.id },
        data: {
          publishUrl,
          // updatedAt: null
        },
      });

      // Increment the survey count after successful survey creation
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          surveyCount: { increment: 1 }, // Increment the surveyCount field
        },
      });

      const response = { ...updatedSurvey, publishUrl };

      return Utils.response({
        message: "Survey Succesfully Created",
        data: {
          response,
        },
      });
      // } catch (error) {
      //   throw new HttpException(error, error.message);
      // }
    } catch (error) {
      if (error instanceof HttpException) {
        // Re-throw if it’s already an HttpException
        throw error;
      }
      console.error("Internal server error:", error); // Log unexpected errors
      throw new HttpException(
        "An internal error occurred. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllSurveys0(paramsObj: SurveyQuery, userId: string): Promise<any> {
    console.log(userId);
    const pageNumber = paramsObj.pageNumber || 1;
    const pageSize = paramsObj.pageSize || 10;
    const skip = (pageNumber - 1) * pageSize;
    const orderBy = paramsObj.sortBy || "id";
    const search = paramsObj.search;
    const orderDirection = paramsObj.sortDir || "desc";
    const startDate = paramsObj.startDate || null;
    const endDate = paramsObj.endDate || null;

    const dateParams: object = {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    };

    const filterParams: object = search
      ? {
          OR: [
            { heading: { contains: search, mode: "insensitive" } },
            { subHeading: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Fetch the user details
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const surveyCount = await this.prisma.survey.aggregate({
      where: {
        createdById: userId, // Only include surveys created by the logged-in user
      },
      _count: true,
    });

    const surveys = await this.prisma.survey.findMany({
      take: Number(pageSize + 1),
      skip,
      where: {
        ...filterParams,
        ...dateParams,
        createdById: userId, // Created by the current logged-in user (admin || teammate || observer)
        adminId: user.adminId ? user.adminId : undefined,
        //adminId: user.adminId != null ? user.adminId : null,
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

    // Add responseCount to each survey
    const enhancedSurveys = edges.map((survey) => {
      const responseCount = survey.questions.reduce((acc, question) => {
        return acc + question.responses.length;
      }, 0);

      return {
        ...survey,
        responseCount, // Add responseCount before questions
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

  async getAllSurveys(paramsObj: SurveyQuery, userId: string): Promise<any> {
    const pageNumber = paramsObj.pageNumber || 1;
    const pageSize = paramsObj.pageSize || 10;
    const skip = (pageNumber - 1) * pageSize;
    const orderBy = paramsObj.sortBy || "id";
    const search = paramsObj.search;
    const orderDirection = paramsObj.sortDir || "desc";
    const startDate = paramsObj.startDate || null;
    const endDate = paramsObj.endDate || null;

    const dateParams: object = {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    };

    const filterParams: object = search
      ? {
          OR: [
            { heading: { contains: search, mode: "insensitive" } },
            { subHeading: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Fetch the user details
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

    // Add unique responseCount to each survey
    const enhancedSurveys = edges.map((survey) => {
      // Create a set to hold unique recipientIds
      const uniqueRecipients = new Set<string>();

      // Collect unique recipientIds from responses
      survey.questions.forEach((question) => {
        question.responses.forEach((response) => {
          uniqueRecipients.add(response.recipientId);
        });
      });

      return {
        ...survey,
        responseCount: uniqueRecipients.size, // Only count unique recipientIds
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

  async getAllSurveys1(): Promise<any> {
    const surveys = await this.prisma.survey.findMany({
      include: {
        questions: {
          include: {
            responses: {
              select: {
                _count: true, // Count the number of responses for each question
              },
            },
          },
        },
      },
    });

    // Mapping through surveys to calculate the responseCount for each question and for the entire survey
    const data = surveys.map((survey) => {
      // Calculate total response count for the survey (sum of all questions' response counts)
      const totalResponseCount = survey.questions.reduce((acc, question) => {
        return acc + question.responses.length;
      }, 0);

      return {
        ...survey,
        responseCount: totalResponseCount, // Total response count for the survey
        questions: survey.questions.map((question) => ({
          ...question,
          responseCount: question.responses.length, // Total response count per question
        })),
      };
    });

    return data; // Return the result with surveys and their respective question and survey response counts
  }

  async getAllSurveysbk(paramsObj: SurveyQuery, userId: string): Promise<any> {
    console.log(userId);
    const pageNumber = paramsObj.pageNumber || 1;
    const pageSize = paramsObj.pageSize || 10;
    const skip = (pageNumber - 1) * pageSize;
    const orderBy = paramsObj.sortBy || "id";
    const search = paramsObj.search;
    const orderDirection = paramsObj.sortDir || "desc";
    const startDate = paramsObj.startDate || null;
    const endDate = paramsObj.endDate || null;

    const dateParams: object = {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    };

    const filterParams: object = search
      ? {
          OR: [
            { heading: { contains: search, mode: "insensitive" } },
            { subHeading: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Fetch the user details
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const surveyCount = await this.prisma.survey.aggregate({
      where: {
        createdById: userId, // Only include surveys created by the logged-in user
      },
      _count: true,
    });

    const surveys = await this.prisma.survey.findMany({
      take: Number(pageSize + 1),
      skip,
      where: {
        ...filterParams,
        ...dateParams,
        createdById: userId, // Created by the current logged-in user (admin || teammate || observer)
        adminId: user.adminId != null ? user.adminId : null,
      },
      include: {
        //createdBy:true,
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

  async getSurveyById(id: string) {
    // const survey = await this.prisma.survey.findUnique(id)
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

    await Utils.checkEntityExists(survey, id, "Survey");
    return survey;
  }

  async updateSurveyWorking(
    id: string,
    data: UpdateSurveyDto
    // userId: string
  ): Promise<ResponseData> {
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
        throw new HttpException("Survey not found", HttpStatus.NOT_FOUND);
      }

      // Delete existing options first
      for (const question of existingSurvey.questions) {
        await this.prisma.option.deleteMany({
          where: { questionId: question.id },
        });
      }

      // Delete existing questions
      await this.prisma.question.deleteMany({
        where: { surveyId: id },
      });

      // Update the survey details
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
          // createdBy: userId,
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

      // Update the survey to store the publishUrl
      const finalUpdatedSurvey = await this.prisma.survey.update({
        where: { id: updatedSurvey.id },
        data: { publishUrl },
      });

      const response = { ...finalUpdatedSurvey, publishUrl };

      return Utils.response({
        message: "Survey Successfully Updated",
        data: {
          response,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteOptionsForQuestion(questionId: string) {
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

  async deleteResponsesForQuestion(questionId: string) {
    await this.prisma.surveyResponse.deleteMany({
      where: { questionId },
    });
  }

  async updateSurvey(
    id: string,
    data: UpdateSurveyDto
  ): Promise<ResponseData> {
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
        throw new HttpException("Survey not found", HttpStatus.NOT_FOUND);
      }

      // Delete existing questions and their related options, responses
      for (const question of existingSurvey.questions) {
        // Step 1: Delete survey responses related to this question
        await this.deleteResponsesForQuestion(question.id);

        // Step 2: Delete options related to this question
        await this.deleteOptionsForQuestion(question.id);

        // Step 3: Delete the question itself
        await this.prisma.question.delete({
          where: { id: question.id },
        });
      }

      // Update the survey details
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

      // Update the survey to store the publishUrl
      const finalUpdatedSurvey = await this.prisma.survey.update({
        where: { id: updatedSurvey.id },
        data: { publishUrl },
      });

      const response = { ...finalUpdatedSurvey, publishUrl };

      return Utils.response({
        message: "Survey Successfully Updated",
        data: {
          response,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateSurveyTesting(id: string, data: UpdateSurveyDto): Promise<ResponseData> {
    try {
      // Fetch the existing survey with its questions and options
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
        throw new HttpException("Survey not found", HttpStatus.NOT_FOUND);
      }

      // Step 1: Determine questions to delete
      const existingQuestionIds = existingSurvey.questions.map((q) => q.id);
      const updatedQuestionIds = data.questions
        .map((q) => q.id)
        .filter(Boolean); // Filter out new questions without IDs

      const questionIdsToDelete = existingQuestionIds.filter(
        (id) => !updatedQuestionIds.includes(id)
      );

      // Step 2: Delete responses, options, and questions for removed questions
      for (const questionId of questionIdsToDelete) {
        await this.deleteResponsesForQuestion(questionId);
        await this.deleteOptionsForQuestion(questionId);
        await this.prisma.question.delete({ where: { id: questionId } });
      }

      // Step 3: Update the survey and handle new/updated questions
      const updatedSurvey = await this.prisma.survey.update({
        where: { id },
        data: {
          heading: data.heading,
          subHeading: data.subHeading,
          questionType: data.questionType,

          // questions: {
          //   upsert: data.questions.map((question) => ({
          //     where: { id: question.id || "" }, // Use empty string to avoid null errors for new questions
          //     create: {
          //       question: question.question,
          //       questionType: question.questionType,
          //       nps: question.nps,
          //       required: question.required,
          //       options: {
          //         create: question.options.map((option) => ({
          //           value: option.value,
          //           label: option.label,
          //         })),
          //       },
          //     },
          //     update: {
          //       question: question.question,
          //       questionType: question.questionType,
          //       nps: question.nps,
          //       required: question.required,
          //       options: {
          //         deleteMany: {}, // Delete all existing options for this question
          //         create: question.options.map((option) => ({
          //           value: option.value,
          //           label: option.label,
          //         })),
          //       },
          //     },
          //   })),
          // },
          questions: {
            upsert: data.questions.map((question) => ({
              where: { id: question.id || "nonexistent-id" }, // Use a valid default or ensure IDs are valid strings
              create: {
                question: question.question,
                questionType: question.questionType,
                nps: question.nps,
                required: question.required,
                surveyId: question.id, // Ensure surveyId is passed correctly
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
                  deleteMany: {}, // Delete existing options for the question
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

      // Step 4: Update publish URL
      const publishUrl = `${process.env.WEBSITE_URL}/${updatedSurvey.questionType}?id=${updatedSurvey.id}`;
      const finalUpdatedSurvey = await this.prisma.survey.update({
        where: { id: updatedSurvey.id },
        data: { publishUrl },
      });

      const response = { ...finalUpdatedSurvey, publishUrl };

      return Utils.response({
        message: "Survey Successfully Updated",
        data: {
          response,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateSurveyWithoutResponses(
    id: string,
    data: UpdateSurveyDto
  ): Promise<ResponseData> {
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
        throw new HttpException("Survey not found", HttpStatus.NOT_FOUND);
      }

      // Track question IDs to update, add, and delete
      const existingQuestionIds = existingSurvey.questions.map((q) => q.id);
      const incomingQuestionIds = data.questions
        .map((q) => q.id)
        .filter(Boolean);
      const questionsToDelete = existingQuestionIds.filter(
        (id) => !incomingQuestionIds.includes(id)
      );

      // Delete questions not in the updated data
      for (const questionId of questionsToDelete) {
        await this.prisma.option.deleteMany({
          where: { questionId },
        });
        await this.prisma.question.delete({
          where: { id: questionId },
        });
      }

      // Update existing questions or add new ones
      for (const questionData of data.questions) {
        if (questionData.id && existingQuestionIds.includes(questionData.id)) {
          // Update existing question
          await this.prisma.question.update({
            where: { id: questionData.id },
            data: {
              question: questionData.question,
              questionType: questionData.questionType,
              nps: questionData.nps,
              required: questionData.required,
            },
          });

          // Update options for the question
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
        } else {
          // Add new question
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

      // Update survey details
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

      return Utils.response({
        message: "Survey Successfully Updated",
        data: { response },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateSurveyStatus(
    surveyId: string,
    updateSurveyStatus: UpdateSurveyStatus
  ) {
    try {
      // console.log("here", surveyId);
      const surveyExists = await this.prisma.survey.findFirst({
        where: { id: surveyId },
      });

      if (!surveyExists) {
        throw new NotFoundException("Survey does not exist");
      }

      const statusUpdate = this.prisma.survey.update({
        where: { id: surveyId },
        data: { status: updateSurveyStatus.status },
      });

      return statusUpdate;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  // async deleteSurvey(id: string) {
  //   // Fetch all questions related to the survey
  //   const questions = await this.prisma.question.findMany({
  //     where: { surveyId: id },
  //     include: { options: true },
  //   });

  //   // Delete all options related to each question
  //   for (const question of questions) {
  //     await this.prisma.option.deleteMany({
  //       where: { questionId: question.id },
  //     });
  //   }

  //   // Delete all questions related to the survey
  //   await this.prisma.question.deleteMany({
  //     where: { surveyId: id },
  //   });

  //   // Finally, delete the survey
  //   return this.prisma.survey.delete({
  //     where: { id },
  //   });
  // }

  async deleteSurvey(id: string) {
    // Check if the survey exists
    const survey = await this.prisma.survey.findUnique({
      where: { id },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with id ${id} does not exist.`);
    }

    // Fetch all questions related to the survey, including their responses and options
    const questions = await this.prisma.question.findMany({
      where: { surveyId: id },
      include: {
        options: true,
        responses: { include: { options: true } },
      },
    });

    for (const question of questions) {
      // Delete survey response options related to each question's responses
      for (const response of question.responses) {
        await this.prisma.surveyResponseOption.deleteMany({
          where: { surveyResponseId: response.id },
        });
      }

      // Delete survey responses related to the question
      await this.prisma.surveyResponse.deleteMany({
        where: { questionId: question.id },
      });

      // Delete options related to the question
      await this.prisma.option.deleteMany({
        where: { questionId: question.id },
      });
    }

    // Delete all questions related to the survey
    await this.prisma.question.deleteMany({
      where: { surveyId: id },
    });

    // Finally, delete the survey itself
    return this.prisma.survey.delete({
      where: { id },
    });
  }
}
