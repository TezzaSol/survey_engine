import { SurveyStatus, SurveyQuestionType } from "@prisma/client";
export declare class FilterSurveysDto {
    startDate?: string;
    endDate?: string;
    status?: SurveyStatus;
    surveyTemplate?: SurveyQuestionType;
}
