export declare class CreateSurveyResponseDto {
    questionId: string;
    value: number[] | number;
    recipientId: string;
}
export declare class CreateSurveyResponsesDto {
    surveyId: string;
    email: string;
    responses: CreateSurveyResponseDto[];
}
