import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";

import { CreateSurveyResponseDto } from "./dto/create-survey-response.dto";

@Injectable()
export class SurveyResponseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRecipientById(id: string) {
    return this.prisma.recipient.findUnique({
      where: { id },
    });
  }

  async hasFilledSurvey(recipientId: string, surveyId: string) {
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

  // async createResponses(responses: CreateSurveyResponseDto[]) {
  //   const createPromises = responses.map((response) =>
  //     this.prisma.surveyResponse.create({
  //       data: {
  //         questionId: response.questionId,
  //         optionId: response.optionId,
  //         recipientId: response.recipientId,
  //       },
  //       include: {
  //       // recipient: true,
  //         question: true,
  //         option: true,
  //       },
  //     })
  //   );

  //   return await Promise.all(createPromises);
  // }

  async createResponses(deviceType: string, responses: CreateSurveyResponseDto[]) {
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


  async deleteResponses1(recipientId: string, responseIds: string[]) {
    return this.prisma.surveyResponse.deleteMany({
      where: {
        recipientId,
        id: { in: responseIds },
      },
    });
  }

  async deleteRecipientsResponses(recipientId: string, responseIds: string[]) {
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

  async deleteResponses(recipientId: string, responseIds: string[]) {
    return this.prisma.surveyResponse.deleteMany({
      where: {
        recipientId,
        id: { in: responseIds },
      },
    });
  }

  async deleteAllResponses(recipientId: string) {
    return this.prisma.surveyResponse.deleteMany({
      where: { recipientId },
    });
  }
}
