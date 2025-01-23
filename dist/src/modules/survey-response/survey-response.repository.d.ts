import { PrismaService } from "../../shared/services/prisma.service";
import { CreateSurveyResponseDto } from "./dto/create-survey-response.dto";
export declare class SurveyResponseRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findRecipientById(id: string): Promise<{
        id: string;
        firstname: string;
        lastname: string;
        phoneNumber: string;
        email: string;
        listId: string;
        deviceType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    hasFilledSurvey(recipientId: string, surveyId: string): Promise<boolean>;
    createResponses(deviceType: string, responses: CreateSurveyResponseDto[]): Promise<({
        question: {
            id: string;
            question: string;
            questionType: import(".prisma/client").$Enums.SurveyQuestionType;
            surveyId: string;
            nps: boolean;
            required: boolean;
            responseCount: number;
        };
    } & {
        id: string;
        questionId: string;
        recipientId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    deleteResponses1(recipientId: string, responseIds: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteRecipientsResponses(recipientId: string, responseIds: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteResponses(recipientId: string, responseIds: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteAllResponses(recipientId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
