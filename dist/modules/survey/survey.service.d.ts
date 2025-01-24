import { PrismaService } from "../../shared/services/prisma.service";
import { CreateSurveyDto } from "./dtos/create-survey.dto";
import { ResponseData } from "../../../src/shared/interfaces";
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
export declare class SurveyService {
    private prisma;
    private mailGunService;
    constructor(prisma: PrismaService, mailGunService: MailGunService);
    createSurvey(data: CreateSurveyDto, userId: string): Promise<ResponseData>;
    getAllSurveys0(paramsObj: SurveyQuery, userId: string): Promise<any>;
    getAllSurveys(paramsObj: SurveyQuery, userId: string): Promise<any>;
    getAllSurveys1(): Promise<any>;
    getAllSurveysbk(paramsObj: SurveyQuery, userId: string): Promise<any>;
    getSurveyById(id: string): Promise<{
        questions: ({
            options: {
                id: string;
                value: import(".prisma/client").Prisma.JsonValue;
                label: string;
                questionId: string;
            }[];
        } & {
            id: string;
            question: string;
            questionType: import(".prisma/client").$Enums.SurveyQuestionType;
            surveyId: string;
            nps: boolean;
            required: boolean;
            responseCount: number;
        })[];
    } & {
        id: string;
        adminId: string;
        heading: string;
        subHeading: string;
        questionType: import(".prisma/client").$Enums.SurveyQuestionType;
        status: import(".prisma/client").$Enums.SurveyStatus;
        responseCount: number;
        publishUrl: string;
        publishedAt: Date;
        createdById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSurveyWorking(id: string, data: UpdateSurveyDto): Promise<ResponseData>;
    deleteOptionsForQuestion(questionId: string): Promise<void>;
    deleteResponsesForQuestion(questionId: string): Promise<void>;
    updateSurvey(id: string, data: UpdateSurveyDto): Promise<ResponseData>;
    updateSurveyTesting(id: string, data: UpdateSurveyDto): Promise<ResponseData>;
    updateSurveyWithoutResponses(id: string, data: UpdateSurveyDto): Promise<ResponseData>;
    updateSurveyStatus(surveyId: string, updateSurveyStatus: UpdateSurveyStatus): Promise<{
        id: string;
        adminId: string;
        heading: string;
        subHeading: string;
        questionType: import(".prisma/client").$Enums.SurveyQuestionType;
        status: import(".prisma/client").$Enums.SurveyStatus;
        responseCount: number;
        publishUrl: string;
        publishedAt: Date;
        createdById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteSurvey(id: string): Promise<{
        id: string;
        adminId: string;
        heading: string;
        subHeading: string;
        questionType: import(".prisma/client").$Enums.SurveyQuestionType;
        status: import(".prisma/client").$Enums.SurveyStatus;
        responseCount: number;
        publishUrl: string;
        publishedAt: Date;
        createdById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
