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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyController = void 0;
const common_1 = require("@nestjs/common");
const survey_service_1 = require("./survey.service");
const create_survey_dto_1 = require("./dtos/create-survey.dto");
const update_survey_dto_1 = require("./dtos/update-survey.dto");
const user_role_enum_1 = require("../../shared/enums/user-role.enum");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const update_survey_status_dto_1 = require("./dtos/update-survey-status.dto");
let SurveyController = class SurveyController {
    constructor(surveyService) {
        this.surveyService = surveyService;
    }
    async createSurvey(createSurveyDto, req) {
        const userId = req.user.sub;
        return this.surveyService.createSurvey(createSurveyDto, userId);
    }
    async getAllSurveys(params, req) {
        const userId = req.user?.sub;
        return this.surveyService.getAllSurveys({
            search: params.q,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            sortBy: params.sortBy,
            sortDir: params.sortDir,
            startDate: params.startDate,
            endDate: params.endDate,
        }, userId);
    }
    async getAllSurveys1() {
        return this.surveyService.getAllSurveys1();
    }
    async getSurveyById(id) {
        return this.surveyService.getSurveyById(id);
    }
    update(id, updateSurveyDto) {
        return this.surveyService.updateSurvey(id, updateSurveyDto);
    }
    async updateSurveyStatus(surveyId, updateSurveyStatus) {
        return this.surveyService.updateSurveyStatus(surveyId, updateSurveyStatus);
    }
    remove(id) {
        return this.surveyService.deleteSurvey(id);
    }
};
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_survey_dto_1.CreateSurveyDto, Object]),
    __metadata("design:returntype", Promise)
], SurveyController.prototype, "createSurvey", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SurveyController.prototype, "getAllSurveys", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SurveyController.prototype, "getAllSurveys1", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurveyController.prototype, "getSurveyById", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_survey_dto_1.UpdateSurveyDto]),
    __metadata("design:returntype", void 0)
], SurveyController.prototype, "update", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Patch)("update-status/:surveyId"),
    __param(0, (0, common_1.Param)("surveyId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_survey_status_dto_1.UpdateSurveyStatus]),
    __metadata("design:returntype", Promise)
], SurveyController.prototype, "updateSurveyStatus", null);
__decorate([
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SurveyController.prototype, "remove", null);
SurveyController = __decorate([
    (0, common_1.Controller)("surveys"),
    __metadata("design:paramtypes", [survey_service_1.SurveyService])
], SurveyController);
exports.SurveyController = SurveyController;
//# sourceMappingURL=survey.controller.js.map