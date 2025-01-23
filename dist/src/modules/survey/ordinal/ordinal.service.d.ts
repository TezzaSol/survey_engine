import { PrismaService } from "../../../shared/services/prisma.service";
import { CreateOrdinalScaleSurveyDto } from "./dtos/create-ordinal-scale-survey.dto";
export declare class OrdinalService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrdinalScaleSurvey(data: CreateOrdinalScaleSurveyDto, userId: string): Promise<{
        questions: ({
            options: {
                id: string;
                value: number;
                label: string;
                questionId: string;
            }[];
        } & {
            id: string;
            question: string;
            surveyId: string;
        })[];
    } & {
        id: string;
        heading: string;
        subHeading: string;
        questionType: string;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllSurveys(): Promise<({
        questions: ({
            options: {
                id: string;
                value: number;
                label: string;
                questionId: string;
            }[];
        } & {
            id: string;
            question: string;
            surveyId: string;
        })[];
    } & {
        id: string;
        heading: string;
        subHeading: string;
        questionType: string;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getSurveyById(id: string): Promise<{
        questions: ({
            options: {
                id: string;
                value: number;
                label: string;
                questionId: string;
            }[];
        } & {
            id: string;
            question: string;
            surveyId: string;
        })[];
    } & {
        id: string;
        heading: string;
        subHeading: string;
        questionType: string;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
