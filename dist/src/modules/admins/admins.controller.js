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
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("./admins.service");
const user_dto_1 = require("../users/dtos/user.dto");
const create_user_dto_1 = require("./dtos/create-user.dto");
const update_user_dto_1 = require("./dtos/update-user.dto");
const role_guard_1 = require("../../common/guards/role.guard");
const user_role_enum_1 = require("../../shared/enums/user-role.enum");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../../shared/services/cloudinary.service");
let AdminsController = class AdminsController {
    constructor(adminsService, cloudinaryService) {
        this.adminsService = adminsService;
        this.cloudinaryService = cloudinaryService;
    }
    create(createUserDto, req) {
        const id = req.user.sub;
        return this.adminsService.createUser(id, createUserDto);
    }
    findAllOld(params) {
        return this.adminsService.findUsersOld({
            search: params.q,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            sortBy: params.sortBy,
            sortDir: params.sortDir,
        });
    }
    findAll(req, params) {
        const adminId = req.user.sub;
        const UserQueryArg = {
            search: params.q,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            sortBy: params.sortBy,
            sortDir: params.sortDir,
            adminId: params.adminId,
        };
        return this.adminsService.findUsers(adminId, UserQueryArg);
    }
    async findOne(id) {
        let user = await this.adminsService.findUser(id);
        return new user_entity_1.UserEntity(user);
    }
    async update(id, updateUserDto) {
        let user = await this.adminsService.updateUser(id, updateUserDto);
        return new user_entity_1.UserEntity(user);
    }
    async transferRole(id, updateUserDto) {
        let user = await this.adminsService.transferRole(id, updateUserDto);
        return new user_entity_1.UserEntity(user);
    }
    remove(userIds) {
        const userIdArray = userIds.split(",");
        return this.adminsService.removeUsers(userIdArray);
    }
    async updateOrganizationDetails(id, updateOrgDto) {
        let user = await this.adminsService.updateOrganizationDetails(id, updateOrgDto);
        return new user_entity_1.UserEntity(user);
    }
    async updateThemeColor(id, updateOrgDto) {
        let user = await this.adminsService.updateThemeColor(id, updateOrgDto);
        return new user_entity_1.UserEntity(user);
    }
    async uploadLogo(logo, req) {
        const id = req.user.sub;
        const logoUrl = await this.cloudinaryService.uploadLogo(logo);
        return this.adminsService.updateCompanyLogo(id, logoUrl.secure_url);
    }
};
__decorate([
    (0, common_1.Post)("users"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("usersOld"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "findAllOld", null);
__decorate([
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("users/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)("users/:id"),
    (0, common_1.Patch)("users/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("transfer-role/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "transferRole", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)("users"),
    __param(0, (0, common_1.Query)("ids")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)("update-organization-details/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateOrgDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateOrganizationDetails", null);
__decorate([
    (0, common_1.Put)("update-theme-color/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateOrgDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateThemeColor", null);
__decorate([
    (0, common_1.Patch)("upload-logo"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("logo")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "uploadLogo", null);
AdminsController = __decorate([
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.Controller)("admin"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [admins_service_1.AdminsService,
        cloudinary_service_1.CloudinaryService])
], AdminsController);
exports.AdminsController = AdminsController;
//# sourceMappingURL=admins.controller.js.map