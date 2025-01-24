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
exports.ChangePassDto = exports.PasswordResetDto = exports.TwoFADto = exports.LoginUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class LoginUserDto {
}
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase()),
    (0, class_validator_1.Matches)(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
        message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
    }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 50),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
        message: "Password must be at least 10 characters long, contain letters, numbers, and special characters",
    }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
exports.LoginUserDto = LoginUserDto;
class TwoFADto {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TwoFADto.prototype, "isTwoFactorCodeActive", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 6),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TwoFADto.prototype, "twoFactorCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TwoFADto.prototype, "twoFactorExpiry", void 0);
exports.TwoFADto = TwoFADto;
class PasswordResetDto {
}
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase()),
    (0, class_validator_1.Matches)(/^.*@(tezzasolutions|mailinator|gmail|yahoo|outlook)\.com$/, {
        message: "Email must be from tezzasolutions, gmail, yahoo, or outlook",
    }),
    __metadata("design:type", String)
], PasswordResetDto.prototype, "email", void 0);
exports.PasswordResetDto = PasswordResetDto;
class ChangePassDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePassDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 50),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
        message: "Password must be at least 10 characters long, contain letters, numbers, and special characters",
    }),
    __metadata("design:type", String)
], ChangePassDto.prototype, "password", void 0);
exports.ChangePassDto = ChangePassDto;
//# sourceMappingURL=login-user.dto.js.map