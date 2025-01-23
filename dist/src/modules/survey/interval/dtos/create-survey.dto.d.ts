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
export {};
