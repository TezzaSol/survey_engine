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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridService = void 0;
const common_1 = require("@nestjs/common");
const mail_1 = __importDefault(require("@sendgrid/mail"));
let SendGridService = class SendGridService {
    constructor() {
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async sendEmail(to, subject, content) {
        const msg = {
            to,
            from: process.env.DEFAULT_MAIL,
            subject,
            text: content,
        };
        await mail_1.default.send(msg);
    }
};
SendGridService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SendGridService);
exports.SendGridService = SendGridService;
//# sourceMappingURL=sendgrid.service.js.map