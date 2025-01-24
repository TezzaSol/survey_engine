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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const utils_1 = require("../../shared/utils");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
const scheduler_service_1 = require("../scheduler/scheduler.service");
const csv = require("csv-parser");
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const cloudinary_service_1 = require("../../shared/services/cloudinary.service");
let RecipientService = class RecipientService {
    constructor(prisma, mailGunService, schedulerService, cloudinaryService) {
        this.prisma = prisma;
        this.mailGunService = mailGunService;
        this.schedulerService = schedulerService;
        this.cloudinaryService = cloudinaryService;
    }
    async addRecipient(data) {
        const recipient = await this.prisma.recipient.findFirst({
            where: {
                email: data?.email,
                listId: data?.listId,
            },
        });
        if (recipient) {
            throw new common_1.ConflictException("Recipient already exits");
        }
        const list = await this.prisma.list.findFirst({
            where: { id: data?.listId },
        });
        if (!list) {
            throw new common_1.ConflictException(`list with this id ${data?.listId} doesnt exits`);
        }
        return this.prisma.recipient.create({ data });
    }
    async getAllRecipients(params) {
        const recipientCount = await this.prisma.recipient.aggregate({
            _count: true,
        });
        const filterParams = params.q
            ? {
                OR: [
                    { firstname: { contains: params.q, mode: "insensitive" } },
                    { lastname: { contains: params.q, mode: "insensitive" } },
                ],
            }
            : {};
        params.sortBy = params.sortBy || "id";
        params.sortDir = params.sortDir || "desc";
        params.pageSize = params.pageSize || 10;
        params.pageNumber = params.pageNumber || 1;
        const recipients = await this.prisma.recipient.findMany({
            take: Number(params.pageSize + 1) | 11,
            where: { ...filterParams },
            orderBy: params.sortBy ? { [params.sortBy]: params.sortDir } : undefined,
        });
        const hasNextPage = recipients.length > params.pageSize;
        const edges = hasNextPage
            ? recipients.slice(0, params.pageSize)
            : recipients;
        return {
            meta: {
                q: params.q,
                startDate: params.startDate,
                endDate: params.endDate,
                sortBy: params.sortBy,
                sortDir: params.sortDir,
                pageSize: params.pageSize,
                pageNumber: params.pageNumber,
                hasNextPage: hasNextPage,
                endCursor: hasNextPage ? edges[params.pageSize - 1].id : null,
                totalPages: Math.ceil(recipients.length / params.pageSize),
                totalItems: recipientCount?._count,
            },
            data: hasNextPage ? recipients.slice(0, params.pageSize) : recipients,
        };
    }
    async deleteRecipientsByListId(listId, recipientIds) {
        const listExists = await this.prisma.list.findUnique({
            where: { id: listId },
        });
        if (!listExists) {
            throw new common_1.NotFoundException(`List with ID ${listId} does not exist`);
        }
        return this.prisma.recipient.deleteMany({
            where: {
                listId: listId,
                id: { in: recipientIds },
            },
        });
    }
    async updateRecipient(id, data) {
        return this.prisma.recipient.update({
            where: { id },
            data,
        });
    }
    async sendInvites(listId, sendInviteDto) {
        try {
            const list = await this.prisma.list.findUnique({
                where: { id: listId },
                include: { recipients: true },
            });
            if (!list) {
                throw new common_1.NotFoundException(`List with ID ${listId} does not exist`);
            }
            await this.prisma.survey.update({
                where: { id: sendInviteDto.surveyId },
                data: {
                    status: "PUBLISHED",
                    publishedAt: new Date()
                },
            });
            const recipientDetails = list.recipients.map((recipient) => ({
                id: recipient.id,
                email: recipient.email,
                firstname: recipient.firstname,
            }));
            for (const recipient of recipientDetails) {
                const subject = `You’ve Been Invited to Take a Survey!`;
                const text = `Hi! Click on the link to fill the survey: ${sendInviteDto.publishUrl}&recipientsId=${recipient.id}`;
                const context = {
                    user: recipient?.firstname || "there",
                    appName: process.env.APP_NAME,
                    surveyUrl: `${sendInviteDto.publishUrl}&recipientsId=${recipient.id}`,
                };
                const templateName = "send-survey";
                await this.mailGunService.sendEmailWithTemplate({
                    to: recipient.email,
                    subject,
                    templateName,
                    context,
                });
            }
            return utils_1.Utils.response({
                message: "Invites Sent Successfully",
            });
        }
        catch (error) {
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async scheduleSurvey(listId, scheduleSurveyDto) {
        const sendAt = new Date(scheduleSurveyDto.sendAt).getTime();
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            include: { recipients: true },
        });
        if (!list) {
            throw new common_1.NotFoundException(`List with ID ${listId} does not exist`);
        }
        await this.prisma.survey.update({
            where: { id: scheduleSurveyDto.surveyId },
            data: { status: "PUBLISHED" },
        });
        const recipientDetails = list.recipients.map((recipient) => ({
            id: recipient.id,
            email: recipient.email,
            firstname: recipient.firstname,
        }));
        const currentTime = new Date().getTime();
        const delay = sendAt - currentTime;
        if (delay < 0) {
            throw new common_1.NotFoundException("Scheduled date must be in the future");
        }
        setTimeout(async () => {
            for (const recipient of recipientDetails) {
                const subject = `You’ve Been Invited to Take a Survey!`;
                const templateName = "send-survey";
                const context = {
                    user: recipient?.firstname || "there",
                    appName: process.env.APP_NAME,
                    surveyUrl: `${scheduleSurveyDto.publishUrl}&recipientsId=${recipient.id}`,
                };
                await this.mailGunService.sendEmailWithTemplate({
                    to: recipient.email,
                    subject,
                    templateName,
                    context,
                });
            }
        }, delay);
    }
    async uploadRecipients(listId, filePath) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
        });
        if (!list) {
            throw new common_1.NotFoundException(`List with ID ${listId} does not exist`);
        }
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const recipients = XLSX.utils.sheet_to_json(sheet, {
                header: ["firstname", "lastname", "phoneNumber", "email"],
                range: 1,
            });
            for (const recipient of recipients) {
                if (recipient.firstname &&
                    recipient.lastname &&
                    recipient.phoneNumber &&
                    recipient.email) {
                    const phoneNumberString = recipient.phoneNumber !== null
                        ? recipient.phoneNumber.toString()
                        : null;
                    await this.prisma.recipient.create({
                        data: {
                            firstname: recipient.firstname,
                            lastname: recipient.lastname,
                            phoneNumber: phoneNumberString,
                            email: recipient.email,
                            listId: listId,
                        },
                    });
                }
            }
        }
        catch (error) {
            console.error("Error processing XLSX file:", error);
            throw new common_1.BadRequestException("Failed to process XLSX file");
        }
        finally {
            fs.unlinkSync(filePath);
        }
    }
    async uploadRecipientsCSV(listId, filePath) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
        });
        if (!list) {
            throw new common_1.NotFoundException(`List with ID ${listId} does not exist`);
        }
        const fileUrl = await this.cloudinaryService.uploadFile(filePath);
        console.log(`File uploaded to Cloudinary: ${fileUrl}`);
        const recipients = [];
        const stream = fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => recipients.push({
            firstname: data.firstname,
            lastname: data.lastname,
            phoneNumber: data.phoneNumber,
            email: data.email,
        }))
            .on("end", async () => {
            for (const recipient of recipients) {
                await this.prisma.recipient.create({
                    data: {
                        firstname: recipient.firstname,
                        lastname: recipient.lastname,
                        phoneNumber: recipient.phoneNumber,
                        email: recipient.email,
                        listId: listId,
                    },
                });
            }
        })
            .on("error", (error) => {
            throw new common_1.InternalServerErrorException(`Failed to process CSV file: ${error.message}`);
        });
        await new Promise((resolve, reject) => {
            stream.on("end", resolve);
            stream.on("error", reject);
        });
    }
};
RecipientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailGunService,
        scheduler_service_1.SchedulerService,
        cloudinary_service_1.CloudinaryService])
], RecipientService);
exports.RecipientService = RecipientService;
//# sourceMappingURL=recipient.service.js.map