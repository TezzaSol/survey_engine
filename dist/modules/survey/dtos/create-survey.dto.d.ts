import { SurveyQuestionType, SurveyStatus } from "@prisma/client";
declare class CreateOptionDto {
    value: number[] | number;
    label: string;
}
declare class CreateQuestionDto {
    question: string;
    questionType?: SurveyQuestionType;
    options: CreateOptionDto[];
    nps?: boolean;
    required?: boolean;
}
export declare class CreateSurveyDto {
    adminId: string;
    heading: string;
    subHeading: string;
    questionType?: SurveyQuestionType;
    questions: CreateQuestionDto[];
    status?: SurveyStatus;
    nps?: boolean;
    required?: boolean;
    responces?: Number;
    surveyCount?: Number;
}
export {};
