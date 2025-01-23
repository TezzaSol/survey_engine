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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_dto_1 = require("./dtos/user.dto");
const role_guard_1 = require("../../common/guards/role.guard");
const user_role_enum_1 = require("../../shared/enums/user-role.enum");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const change_password_dto_1 = require("./dtos/change-password.dto");
const reset_password_dto_1 = require("./dtos/reset-password.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const update_theme_color_1 = require("./dtos/update-theme-color");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async resetPassword(id, resetPasswordDto) {
        return this.usersService.resetPassword(id, resetPasswordDto);
    }
    async update(id, updateUserDto) {
        let user = await this.usersService.updateProfile(id, updateUserDto);
        return user;
    }
    async changePassword(id, changePasswordDto) {
        return this.usersService.changePassword(id, changePasswordDto.oldPassword, changePasswordDto.newPassword, changePasswordDto.confirmNewPassword);
    }
    async loginActivity(id, req) {
        return this.usersService.loginActivity(id, req.body.loggedInActivity);
    }
    async archiveUser(id) {
        return await this.usersService.archiveUser(id);
    }
    async deleteUser(id) {
        return await this.usersService.deleteUser(id);
    }
    async updateThemeColor(userId, updateThemeColorDto) {
        return this.usersService.updateThemeColor(userId, updateThemeColorDto);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)("reset-password/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("change-password/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Put)("login-activity/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "loginActivity", null);
__decorate([
    (0, common_1.Put)("archive/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "archiveUser", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)("delete/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)("theme-color/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_theme_color_1.UpdateThemeColorDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateThemeColor", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.User),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map