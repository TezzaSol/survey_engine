declare class CreateOptionDto {
    value: number;
    label: string;
}
declare class CreateQuestionDto {
    question: string;
    options: CreateOptionDto[];
}
export declare class CreateSurveyDto {
    heading: string;
    subHeading: string;
    questionType: string;
    questions: CreateQuestionDto[];
    updatedAt?: Date;
}
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
