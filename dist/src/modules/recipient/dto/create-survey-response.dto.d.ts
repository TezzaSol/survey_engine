declare class CreateSurveyResponseDto {
    questionId: string;
    answer: number[] | number;
    email: string;
    recipientId: string;
}
export declare class CreateSurveyResponsesDto {
    responses: CreateSurveyResponseDto[];
}
export {};
