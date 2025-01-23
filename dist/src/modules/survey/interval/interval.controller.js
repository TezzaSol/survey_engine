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
exports.IntervalController = void 0;
const common_1 = require("@nestjs/common");
const create_interval_scale_survey_dto_1 = require("./dtos/create-interval-scale-survey.dto");
const role_guard_1 = require("../../../common/guards/role.guard");
const user_role_enum_1 = require("../../../shared/enums/user-role.enum");
const role_decorator_1 = require("../../../common/decorators/role.decorator");
const interval_service_1 = require("./interval.service");
let IntervalController = class IntervalController {
    constructor(intervalService) {
        this.intervalService = intervalService;
    }
    async createIntervalScaleSurvey(createIntervalScaleSurvey, req) {
        const userId = req.user.id;
        return this.intervalService.createIntervalScaleSurvey(createIntervalScaleSurvey, userId);
    }
    async getAllSurveys() {
        return this.intervalService.getAllSurveys();
    }
    async getSurveyById(id) {
        return this.intervalService.getSurveyById(id);
    }
};
__decorate([
    (0, common_1.Post)("surveys"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_interval_scale_survey_dto_1.CreateIntervalScaleSurveyDto, Object]),
    __metadata("design:returntype", Promise)
], IntervalController.prototype, "createIntervalScaleSurvey", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntervalController.prototype, "getAllSurveys", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntervalController.prototype, "getSurveyById", null);
IntervalController = __decorate([
    (0, common_1.Controller)("survey/interval"),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [interval_service_1.IntervalService])
], IntervalController);
exports.IntervalController = IntervalController;
//# sourceMappingURL=interval.controller.js.map