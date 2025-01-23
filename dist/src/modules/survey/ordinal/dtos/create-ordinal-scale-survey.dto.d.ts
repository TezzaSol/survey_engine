declare class CreateOrdinalScaleOptionDto {
    value: number;
    label: string;
}
declare class CreateOrdinalScaleQuestionDto {
    question: string;
    options: CreateOrdinalScaleOptionDto[];
}
export declare class CreateOrdinalScaleSurveyDto {
    heading: string;
    subHeading: string;
    questionType: string;
    questions: CreateOrdinalScaleQuestionDto[];
    updatedAt?: Date;
}
export {};
