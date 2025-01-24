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
exports.RecipientController = void 0;
const common_1 = require("@nestjs/common");
const recipient_service_1 = require("./recipient.service");
const create_recipient_dto_1 = require("./dto/create-recipient.dto");
const update_recipient_dto_1 = require("./dto/update-recipient.dto");
const send_invite_dto_1 = require("./dto/send-invite.dto");
const schedule_survey_dto_1 = require("./dto/schedule-survey.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let RecipientController = class RecipientController {
    constructor(recipientService) {
        this.recipientService = recipientService;
    }
    addRecipient(createRecipientDto) {
        return this.recipientService.addRecipient(createRecipientDto);
    }
    async findAll(params) {
        return await this.recipientService.getAllRecipients(params);
    }
    updateRecipient(id, updateRecipientDto) {
        return this.recipientService.updateRecipient(id, updateRecipientDto);
    }
    deleteRecipientsByListId(recipientIds, listId) {
        const recipientIddArray = recipientIds.split(",");
        return this.recipientService.deleteRecipientsByListId(listId, recipientIddArray);
    }
    async sendInvites(listId, sendInviteDto) {
        await this.recipientService.sendInvites(listId, sendInviteDto);
    }
    async scheduleSurvey(listId, scheduleSurveyDto) {
        await this.recipientService.scheduleSurvey(listId, scheduleSurveyDto);
    }
    async uploadRecipients(listId, file) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        await this.recipientService.uploadRecipients(listId, file.path);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_recipient_dto_1.CreateRecipientDto]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "addRecipient", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_recipient_dto_1.UpdateRecipientDto]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "updateRecipient", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)(":listId"),
    __param(0, (0, common_1.Query)("recipientIds")),
    __param(1, (0, common_1.Param)("listId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "deleteRecipientsByListId", null);
__decorate([
    (0, common_1.Post)(":id/send-invites"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_invite_dto_1.SendInviteDto]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "sendInvites", null);
__decorate([
    (0, common_1.Post)(":id/schedule-survey"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_survey_dto_1.ScheduleSurveyDto]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "scheduleSurvey", null);
__decorate([
    (0, common_1.Post)(":id/import-recipients"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads",
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                return callback(new common_1.BadRequestException("Only XLSX and XLS files are allowed!"), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RecipientController.prototype, "uploadRecipients", null);
RecipientController = __decorate([
    (0, common_1.Controller)("recipients"),
    __metadata("design:paramtypes", [recipient_service_1.RecipientService])
], RecipientController);
exports.RecipientController = RecipientController;
//# sourceMappingURL=recipient.controller.js.map