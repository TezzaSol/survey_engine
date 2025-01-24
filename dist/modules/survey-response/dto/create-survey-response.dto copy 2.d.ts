declare class CreateSurveyResponseDto {
    questionId: string;
    answer: number[] | number;
    recipientId: string;
}
export declare class CreateSurveyResponsesDto {
    responses: CreateSurveyResponseDto[];
    surveyId?: string;
    recipientId?: string;
    email?: string;
}
export {};
