import { CreateSurveyResponseDto } from "./create-survey-response.dto";
export declare class CreateSurveyResponsesDto {
    recipientId?: string;
    surveyId: string;
    responses: CreateSurveyResponseDto[];
}
