import { PrismaService } from "../../shared/services/prisma.service";
import { Recipient, Prisma } from "@prisma/client";
import { CreateRecipientDto } from "./dto/create-recipient.dto";
import { UpdateRecipientDto } from "./dto/update-recipient.dto";
import { PageParams, PagedResponse } from "src/shared/interfaces";
import { SendInviteDto } from "../recipient/dto/send-invite.dto";
import { ResponseData } from "../../shared/interfaces";
import { MailGunService } from "../../shared/services/mailgun.service";
import { SchedulerService } from "../scheduler/scheduler.service";
import { ScheduleSurveyDto } from "./dto/schedule-survey.dto";
import { CloudinaryService } from "../../shared/services/cloudinary.service";
export declare class RecipientService {
    private prisma;
    private mailGunService;
    private schedulerService;
    private cloudinaryService;
    constructor(prisma: PrismaService, mailGunService: MailGunService, schedulerService: SchedulerService, cloudinaryService: CloudinaryService);
    addRecipient(data: CreateRecipientDto): Promise<Recipient>;
    getAllRecipients(params: PageParams): Promise<PagedResponse>;
    deleteRecipientsByListId(listId: string, recipientIds: string[]): Promise<Prisma.BatchPayload>;
    updateRecipient(id: string, data: UpdateRecipientDto): Promise<Recipient>;
    sendInvites(listId: string, sendInviteDto: SendInviteDto): Promise<ResponseData>;
    scheduleSurvey(listId: string, scheduleSurveyDto: ScheduleSurveyDto): Promise<void>;
    uploadRecipients(listId: string, filePath: string): Promise<void>;
    uploadRecipientsCSV(listId: string, filePath: string): Promise<void>;
}
