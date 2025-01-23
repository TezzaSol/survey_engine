import { SurveyQuestionType } from "@prisma/client";
declare class UpdateOptionDto {
    value: number[] | number;
    label: string;
}
declare class UpdateQuestionDto {
    id?: any;
    question: string;
    questionType?: SurveyQuestionType;
    nps: boolean;
    required: boolean;
    options: UpdateOptionDto[];
}
export declare class UpdateSurveyDto {
    heading: string;
    subHeading: string;
    questionType?: SurveyQuestionType;
    questions: UpdateQuestionDto[];
}
export {};
