import { CreateOrdinalScaleSurveyDto } from "./dtos/create-ordinal-scale-survey.dto";
import { OrdinalService } from "./ordinal.service";
export declare class OrdinalController {
    private readonly ordinalService;
    constructor(ordinalService: OrdinalService);
    createOrdinalScaleSurvey(createOrdinalScaleSurvey: CreateOrdinalScaleSurveyDto, req: any): Promise<{
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
