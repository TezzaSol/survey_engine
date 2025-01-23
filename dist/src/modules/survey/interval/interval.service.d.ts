import { PrismaService } from "../../../shared/services/prisma.service";
import { CreateIntervalScaleSurveyDto } from "./dtos/create-interval-scale-survey.dto";
export declare class IntervalService {
    private prisma;
    constructor(prisma: PrismaService);
    createIntervalScaleSurvey(data: CreateIntervalScaleSurveyDto, userId: string): Promise<{
        questions: ({
            options: {
                id: string;
                value: number[];
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
                value: number[];
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
                value: number[];
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
