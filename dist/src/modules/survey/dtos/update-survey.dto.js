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
exports.UpdateSurveyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class UpdateOptionDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((obj) => typeof obj.value === "number"),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], UpdateOptionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOptionDto.prototype, "label", void 0);
class UpdateQuestionDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateQuestionDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SurveyQuestionType),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "questionType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateQuestionDto.prototype, "nps", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateQuestionDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateOptionDto),
    __metadata("design:type", Array)
], UpdateQuestionDto.prototype, "options", void 0);
class UpdateSurveyDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSurveyDto.prototype, "heading", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSurveyDto.prototype, "subHeading", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SurveyQuestionType),
    __metadata("design:type", String)
], UpdateSurveyDto.prototype, "questionType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateQuestionDto),
    __metadata("design:type", Array)
], UpdateSurveyDto.prototype, "questions", void 0);
exports.UpdateSurveyDto = UpdateSurveyDto;
//# sourceMappingURL=update-survey.dto.js.map