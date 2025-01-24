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
exports.GoogleService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const prisma_service_1 = require("./prisma.service");
let GoogleService = class GoogleService {
    constructor(prisma) {
        this.prisma = prisma;
        this.callbackPath = process.env.GOOGLE_REDIRECT_PATH;
        this.googleRedirectUrl = process.env.NODE_ENV == "production"
            ? `${process.env.BACKEND_URI}/${this.callbackPath}`
            : `http://localhost:3000/${this.callbackPath}`;
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, this.googleRedirectUrl);
    }
    getConsentUrl(state) {
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/business.manage",
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            prompt: "consent",
            state: state,
        });
    }
    async getTokens(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        return tokens;
    }
    async verifyBusinessProfileAccount(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({
            auth: this.oauth2Client,
            version: "v2",
        });
        const userInfo = await oauth2.userinfo.get();
        const { email } = userInfo.data;
        const myBusiness = googleapis_1.google.mybusinessaccountmanagement({
            auth: this.oauth2Client,
            version: "v1",
        });
        try {
            const accounts = await myBusiness.accounts.list();
            if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
                throw new common_1.UnauthorizedException("This Google account is not associated with a Google Business Profile.");
            }
            return {
                email,
                accounts: accounts.data.accounts,
                tokens,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Error verifying Google Business Profile association: " + error.message);
        }
    }
};
GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GoogleService);
exports.GoogleService = GoogleService;
//# sourceMappingURL=google.service.js.map