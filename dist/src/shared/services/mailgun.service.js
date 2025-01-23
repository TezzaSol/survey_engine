"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailGunService = void 0;
const common_1 = require("@nestjs/common");
const Handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const prisma_service_1 = require("./prisma.service");
let MailGunService = class MailGunService {
    constructor(prisma) {
        this.prisma = prisma;
        this.mailgun = (0, mailgun_js_1.default)({
            apiKey: `${process.env.MAILGUN_API_KEY}`,
            domain: `${process.env.MAILGUN_DOMAIN}`,
        });
    }
    async sendTrialEndingNotification(email, daysLeft) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });
        const appName = process.env.APP_NAME;
        const subject = "Your free trial is about to end";
        const message = `Dear User, your free trial will end in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Please subscribe to continue using the service.`;
        const templateName = "trial-ending";
        const subscriptionUrl = `${process.env.WEBSITE_URL}/subscription/${user.id}`;
        const context = {
            user: user.firstname || "there",
            daysLeft,
            appName,
            subscriptionUrl,
        };
        await this.sendEmailWithTemplate({
            to: email,
            subject,
            templateName,
            context,
        });
    }
    async sendEmail(to, subject, html) {
        const data = {
            from: `Tezza Business Solutions - ${process.env.DEFAULT_MAILER}`,
            to,
            subject,
            html,
        };
        return this.mailgun.messages().send(data);
    }
    async sendEmailWithTemplate(arg) {
        const template = this.loadTemplate(arg.templateName);
        const html = this.renderTemplate(template, arg.context);
        const data = {
            from: `Tezza Business Solutions - ${process.env.DEFAULT_MAILER}`,
            to: arg.to,
            subject: arg.subject,
            html,
        };
        return this.mailgun.messages().send(data);
    }
    loadTemplate(templateName) {
        const templateDir = path.join(__dirname, "..", "..", "..", "..", "dist", "views", "mailer");
        console.log(`Template directory: ${templateDir}`);
        const templatePath = path.join(templateDir, `${templateName}.hbs`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }
        console.log(`Using template path: ${templatePath}`);
        return fs.readFileSync(templatePath, "utf-8");
    }
    renderTemplate(template, context) {
        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate(context);
    }
};
MailGunService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MailGunService);
exports.MailGunService = MailGunService;
//# sourceMappingURL=mailgun.service.js.map