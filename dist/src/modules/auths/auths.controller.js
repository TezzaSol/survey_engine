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
exports.AuthsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const google_service_1 = require("../../shared/services/google.service");
const auths_service_1 = require("./auths.service");
let AuthsController = class AuthsController {
    constructor(authsService, googleService) {
        this.authsService = authsService;
        this.googleService = googleService;
    }
    async googleLogin(req) {
        const userId = req?.user?.sub;
        const state = Buffer.from(JSON.stringify({ userId })).toString("base64");
        const url = this.googleService.getConsentUrl(state);
        return { url };
    }
    async callback(code, res, state) {
        if (!code) {
            return { message: "Authorization code not found" };
        }
        const { userId } = JSON.parse(Buffer.from(state, "base64").toString());
        const tokens = await this.googleService.getTokens(code);
        const platform = await this.authsService.googleAcc(userId, tokens);
        return res.json({ message: "Authentication successful" });
    }
};
__decorate([
    (0, common_1.Redirect)(),
    (0, common_1.Get)("google"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthsController.prototype, "googleLogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("google/callback"),
    __param(0, (0, common_1.Query)("code")),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AuthsController.prototype, "callback", null);
AuthsController = __decorate([
    (0, common_1.Controller)("auths"),
    __metadata("design:paramtypes", [auths_service_1.AuthsService,
        google_service_1.GoogleService])
], AuthsController);
exports.AuthsController = AuthsController;
//# sourceMappingURL=auths.controller.js.map