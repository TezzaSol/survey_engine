"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./services/prisma.service");
const sendgrid_service_1 = require("./services/sendgrid.service");
const mailgun_service_1 = require("./services/mailgun.service");
const cloudinary_service_1 = require("./services/cloudinary.service");
const google_service_1 = require("./services/google.service");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            sendgrid_service_1.SendGridService,
            mailgun_service_1.MailGunService,
            cloudinary_service_1.CloudinaryService,
            google_service_1.GoogleService,
        ],
        exports: [
            prisma_service_1.PrismaService,
            sendgrid_service_1.SendGridService,
            mailgun_service_1.MailGunService,
            cloudinary_service_1.CloudinaryService,
            google_service_1.GoogleService,
        ],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map