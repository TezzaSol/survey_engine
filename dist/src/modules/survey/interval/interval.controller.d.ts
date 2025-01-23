import { CreateIntervalScaleSurveyDto } from "./dtos/create-interval-scale-survey.dto";
import { IntervalService } from "./interval.service";
export declare class IntervalController {
    private readonly intervalService;
    constructor(intervalService: IntervalService);
    createIntervalScaleSurvey(createIntervalScaleSurvey: CreateIntervalScaleSurveyDto, req: any): Promise<{
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
