import { SurveyResponseRepository } from "./survey-response.repository";
import { CreateSurveyResponsesDto } from "./dto/create-survey-responses.dto";
import { PrismaService } from "../../shared/services/prisma.service";
import { PageParams, PagedResponse } from "src/shared/interfaces";
export declare class SurveyResponseService {
    private prisma;
    private readonly surveyResponseRepository;
    constructor(prisma: PrismaService, surveyResponseRepository: SurveyResponseRepository);
    createResponses(deviceType: string, dto: CreateSurveyResponsesDto): Promise<({
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
    getAllSurveyResponses(): Promise<({
        recipient: {
            id: string;
            firstname: string;
            lastname: string;
            phoneNumber: string;
            email: string;
            listId: string;
            deviceType: string;
            createdAt: Date;
            updatedAt: Date;
        };
        question: {
            id: string;
            question: string;
            questionType: import(".prisma/client").$Enums.SurveyQuestionType;
            surveyId: string;
            nps: boolean;
            required: boolean;
            responseCount: number;
        };
        options: ({
            option: {
                id: string;
                value: import(".prisma/client").Prisma.JsonValue;
                label: string;
                questionId: string;
            };
        } & {
            id: string;
            surveyResponseId: string;
            optionId: string;
        })[];
    } & {
        id: string;
        questionId: string;
        recipientId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getRecipientDataAndResponses(recipientId: string): Promise<{
        surveyResponses: ({
            question: {
                id: string;
                question: string;
                questionType: import(".prisma/client").$Enums.SurveyQuestionType;
                surveyId: string;
                nps: boolean;
                required: boolean;
                responseCount: number;
            };
            options: {
                id: string;
                surveyResponseId: string;
                optionId: string;
            }[];
        } & {
            id: string;
            questionId: string;
            recipientId: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
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
    getSurveyWithResponsesBK(surveyId: string): Promise<{
        totalResponse: number;
        totalSurveySent: number;
        completionRate: string;
        surveyStatus: import(".prisma/client").$Enums.SurveyStatus;
        question: string[];
        responses: any[];
    }>;
    getSurveyWithResponsesWK(surveyId: string): Promise<{
        totalResponse: number;
        totalSurveySent: number;
        completionRate: string;
        surveyStatus: import(".prisma/client").$Enums.SurveyStatus;
        questions: string[];
        responses: any[];
    }>;
    fetchSurveyResponses(filterBySurveyId: any, distinct?: any[], take?: number, skip?: number): Promise<{
        id: string;
        recipient: {
            email: string;
            firstname: string;
            lastname: string;
            phoneNumber: string;
            listId: string;
        };
        recipientId: string;
        options: {
            option: {
                question: {
                    question: string;
                    questionType: import(".prisma/client").$Enums.SurveyQuestionType;
                };
                value: import(".prisma/client").Prisma.JsonValue;
                label: string;
            };
        }[];
    }[]>;
    getSurveyWithResponses(surveyId: string): Promise<{
        totalResponse: number;
        totalSurveySent: number;
        completionRate: string;
        surveyStatus: import(".prisma/client").$Enums.SurveyStatus;
        questions: string[];
        responses: any[];
    }>;
    deleteRecipientResponses(recipientId: string, responseIds?: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteRecipientsResponses(recipientId: string, responseIds: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteResponsesForRecipients(recipientData: {
        recipientId: string;
        responseIds: string[];
    }[]): Promise<void>;
    analyzeResponses(surveyId: string): Promise<{
        meta: {
            promoters: number;
            passives: number;
            detractors: number;
            percentagePromoters: number;
            percentageDetractors: number;
            percentagePassives: number;
            nps: number;
            percentageResponseRate: number;
            totalResponseCount: number;
        };
        data: {
            questionId: string;
            question: any;
            nps: any;
            questionType: any;
            answers: {
                answer: any;
                label: any;
                recipientCount: any;
                percentageCompletion: number;
            }[];
        }[];
    }>;
    getResponses(surveyId: string, params: PageParams): Promise<PagedResponse>;
}
