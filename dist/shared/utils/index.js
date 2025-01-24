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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
class Utils {
    constructor(prisma, jwtService, mailGunService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailGunService = mailGunService;
    }
    static response(data) {
        return {
            message: "data fetched",
            success: true,
            data: null,
            meta: null,
            ...data,
        };
    }
    static unixTimestamp() {
        return Math.floor(Date.now() / 100);
    }
    async sendResetPasswordEmail(email) {
        const user = await this.prisma.user.findFirst({
            where: { email: email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("invalid email address");
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const resetLink = `${process.env.WEBSITE_URL}/reset-password/?token=${token}`;
        const subject = "Reset your password";
        const html = `Click on the link to reset your password: ${resetLink}`;
        await this.mailGunService.sendEmail(email, subject, html);
        return Utils.response({
            message: `password reset link with instructions has been sent to '${email}`,
        });
    }
    static checkEntityExists(entity, id, entityName) {
        if (!entity) {
            throw new common_1.NotFoundException(`${entityName} with id ${id} not found`);
        }
        return entity;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=index.js.map