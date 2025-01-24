import { SurveyService, SurveyQuery } from "./survey.service";
import { CreateSurveyDto } from "./dtos/create-survey.dto";
import { UpdateSurveyDto } from "./dtos/update-survey.dto";
import { ResponseData } from "../../shared/interfaces";
import { UpdateSurveyStatus } from "./dtos/update-survey-status.dto";
export declare class SurveyController {
    private readonly surveyService;
    constructor(surveyService: SurveyService);
    createSurvey(createSurveyDto: CreateSurveyDto, req: any): Promise<ResponseData>;
    getAllSurveys(params: SurveyQuery, req: any): Promise<CreateSurveyDto[]>;
    getAllSurveys1(): Promise<any>;
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
    update(id: string, updateSurveyDto: UpdateSurveyDto): Promise<ResponseData>;
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
    remove(id: string): Promise<{
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
