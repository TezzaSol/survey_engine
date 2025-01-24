"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyResponseController = void 0;
const common_1 = require("@nestjs/common");
const survey_response_service_1 = require("./survey-response.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const create_survey_responses_dto_1 = require("./dto/create-survey-responses.dto");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const user_role_enum_1 = require("../../shared/enums/user-role.enum");
const useragent = __importStar(require("express-useragent"));
let SurveyResponseController = class SurveyResponseController {
    constructor(surveyResponseService) {
        this.surveyResponseService = surveyResponseService;
    }
    async createResponses(req, createSurveyResponsesDto) {
        const deviceType = useragent.parse(req.headers["user-agent"]).isMobile
            ? "mobile"
            : "web";
        console.log("Device Type Is - ", deviceType);
        return this.surveyResponseService.createResponses(deviceType, createSurveyResponsesDto);
    }
    async getAllSurveyResponses() {
        return await this.surveyResponseService.getAllSurveyResponses();
    }
    async deleteResponses(recipientId, responseIds) {
        return this.surveyResponseService.deleteRecipientsResponses(recipientId, responseIds);
    }
    async deleteResponsesForRecipients(body) {
        return this.surveyResponseService.deleteResponsesForRecipients(body.recipientData);
    }
    async responseAnalysis(surveyId) {
        return this.surveyResponseService.analyzeResponses(surveyId);
    }
    async getSurveyWithResponses(surveyId) {
        return await this.surveyResponseService.getSurveyWithResponses(surveyId);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_survey_responses_dto_1.CreateSurveyResponsesDto]),
    __metadata("design:returntype", Promise)
], SurveyResponseController.prototype, "createResponses", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SurveyResponseController.prototype, "getAllSurveyResponses", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Delete)(":recipientId"),
    __param(0, (0, common_1.Param)("recipientId")),
    __param(1, (0, common_1.Body)("responseIds")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SurveyResponseController.prototype, "deleteResponses", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Post)("delete-multiple-recipients-responses"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurveyResponseController.prototype, "deleteResponsesForRecipients", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Get)(":surveyId/analysis"),
    __param(0, (0, common_1.Param)("surveyId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurveyResponseController.prototype, "responseAnalysis", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Get)(":surveyId"),
    __param(0, (0, common_1.Param)("surveyId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurveyResponseController.prototype, "getSurveyWithResponses", null);
SurveyResponseController = __decorate([
    (0, common_1.Controller)("survey-response"),
    __metadata("design:paramtypes", [survey_response_service_1.SurveyResponseService])
], SurveyResponseController);
exports.SurveyResponseController = SurveyResponseController;
//# sourceMappingURL=survey-response.controller.js.map