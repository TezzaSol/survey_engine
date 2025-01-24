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
exports.PlatformController = void 0;
const common_1 = require("@nestjs/common");
const platform_service_1 = require("./platform.service");
const create_platform_dto_1 = require("./dto/create-platform.dto");
const update_platform_dto_1 = require("./dto/update-platform.dto");
let PlatformController = class PlatformController {
    constructor(platformService) {
        this.platformService = platformService;
    }
    create(createPlatformDto, req) {
        const userId = req.user.sub;
        return this.platformService.create(userId, createPlatformDto);
    }
    findAll(req) {
        const userId = req.user.sub;
        return this.platformService.findAll(userId);
    }
    findOne(id, req) {
        const userId = req.user.sub;
        return this.platformService.findOne(id, userId);
    }
    update(id, updatePlatformDto, req) {
        const userId = req.user.sub;
        return this.platformService.update(userId, id, updatePlatformDto);
    }
    remove(id, req) {
        const userId = req.user.sub;
        return this.platformService.remove(userId, id);
    }
    toggleStatus(id, req) {
        const userId = req.user.sub;
        return this.platformService.togglePlatformStatus(userId, id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_platform_dto_1.CreatePlatformDto, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_platform_dto_1.UpdatePlatformDto, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(":id/toggle-active"),
    (0, common_1.Put)(":id/toggle-active"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "toggleStatus", null);
PlatformController = __decorate([
    (0, common_1.Controller)("platforms"),
    __metadata("design:paramtypes", [platform_service_1.PlatformService])
], PlatformController);
exports.PlatformController = PlatformController;
//# sourceMappingURL=platform.controller.js.map