declare class CreateIntervalScaleOptionDto {
    value: number[];
    label: string;
}
declare class CreateIntervalScaleQuestionDto {
    question: string;
    options: CreateIntervalScaleOptionDto[];
}
export declare class CreateIntervalScaleSurveyDto {
    heading: string;
    subHeading: string;
    questionType: string;
    questions: CreateIntervalScaleQuestionDto[];
    updatedAt?: Date;
}
export {};
