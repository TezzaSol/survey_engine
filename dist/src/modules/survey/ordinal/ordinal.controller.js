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
exports.OrdinalController = void 0;
const common_1 = require("@nestjs/common");
const create_ordinal_scale_survey_dto_1 = require("./dtos/create-ordinal-scale-survey.dto");
const role_guard_1 = require("../../../common/guards/role.guard");
const user_role_enum_1 = require("../../../shared/enums/user-role.enum");
const role_decorator_1 = require("../../../common/decorators/role.decorator");
const ordinal_service_1 = require("./ordinal.service");
let OrdinalController = class OrdinalController {
    constructor(ordinalService) {
        this.ordinalService = ordinalService;
    }
    async createOrdinalScaleSurvey(createOrdinalScaleSurvey, req) {
        const userId = req.user.id;
        return this.ordinalService.createOrdinalScaleSurvey(createOrdinalScaleSurvey, userId);
    }
    async getAllSurveys() {
        return this.ordinalService.getAllSurveys();
    }
    async getSurveyById(id) {
        return this.ordinalService.getSurveyById(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ordinal_scale_survey_dto_1.CreateOrdinalScaleSurveyDto, Object]),
    __metadata("design:returntype", Promise)
], OrdinalController.prototype, "createOrdinalScaleSurvey", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdinalController.prototype, "getAllSurveys", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdinalController.prototype, "getSurveyById", null);
OrdinalController = __decorate([
    (0, common_1.Controller)("survey/ordinal"),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ordinal_service_1.OrdinalService])
], OrdinalController);
exports.OrdinalController = OrdinalController;
//# sourceMappingURL=ordinal.controller.js.map