"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIntervalScaleSurveyDto = exports.CreateSurveyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateOptionDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOptionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOptionDto.prototype, "label", void 0);
class CreateQuestionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateOptionDto),
    __metadata("design:type", Array)
], CreateQuestionDto.prototype, "options", void 0);
class CreateSurveyDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "heading", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "subHeading", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "questionType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuestionDto),
    __metadata("design:type", Array)
], CreateSurveyDto.prototype, "questions", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], CreateSurveyDto.prototype, "updatedAt", void 0);
exports.CreateSurveyDto = CreateSurveyDto;
class CreateIntervalScaleOptionDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CreateIntervalScaleOptionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntervalScaleOptionDto.prototype, "label", void 0);
class CreateIntervalScaleQuestionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntervalScaleQuestionDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateIntervalScaleOptionDto),
    __metadata("design:type", Array)
], CreateIntervalScaleQuestionDto.prototype, "options", void 0);
class CreateIntervalScaleSurveyDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntervalScaleSurveyDto.prototype, "heading", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntervalScaleSurveyDto.prototype, "subHeading", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntervalScaleSurveyDto.prototype, "questionType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateIntervalScaleQuestionDto),
    __metadata("design:type", Array)
], CreateIntervalScaleSurveyDto.prototype, "questions", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], CreateIntervalScaleSurveyDto.prototype, "updatedAt", void 0);
exports.CreateIntervalScaleSurveyDto = CreateIntervalScaleSurveyDto;
//# sourceMappingURL=create-survey.dto%20copy.js.map