/// <reference types="multer" />
import { RecipientService } from "./recipient.service";
import { Prisma, Recipient } from "@prisma/client";
import { CreateRecipientDto } from "./dto/create-recipient.dto";
import { UpdateRecipientDto } from "./dto/update-recipient.dto";
import { PageParams, PagedResponse } from "src/shared/interfaces";
import { SendInviteDto } from "./dto/send-invite.dto";
import { ScheduleSurveyDto } from "./dto/schedule-survey.dto";
export declare class RecipientController {
    private readonly recipientService;
    constructor(recipientService: RecipientService);
    addRecipient(createRecipientDto: CreateRecipientDto): Promise<Recipient>;
    findAll(params: PageParams): Promise<PagedResponse>;
    updateRecipient(id: string, updateRecipientDto: UpdateRecipientDto): Promise<Recipient>;
    deleteRecipientsByListId(recipientIds: string, listId: string): Promise<Prisma.BatchPayload>;
    sendInvites(listId: string, sendInviteDto: SendInviteDto): Promise<void>;
    scheduleSurvey(listId: string, scheduleSurveyDto: ScheduleSurveyDto): Promise<void>;
    uploadRecipients(listId: string, file: Express.Multer.File): Promise<void>;
}
