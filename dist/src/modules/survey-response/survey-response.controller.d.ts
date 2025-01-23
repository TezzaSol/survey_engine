import { SurveyResponseService } from "./survey-response.service";
import { CreateSurveyResponsesDto } from "./dto/create-survey-responses.dto";
export declare class SurveyResponseController {
    private readonly surveyResponseService;
    constructor(surveyResponseService: SurveyResponseService);
    createResponses(req: any, createSurveyResponsesDto: CreateSurveyResponsesDto): Promise<({
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
    deleteResponses(recipientId: string, responseIds: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteResponsesForRecipients(body: {
        recipientData: {
            recipientId: string;
            responseIds: string[];
        }[];
    }): Promise<void>;
    responseAnalysis(surveyId: string): Promise<{
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
    getSurveyWithResponses(surveyId: string): Promise<{
        totalResponse: number;
        totalSurveySent: number;
        completionRate: string;
        surveyStatus: import(".prisma/client").$Enums.SurveyStatus;
        questions: string[];
        responses: any[];
    }>;
}
