import {
  Injectable,
  ConflictException,
  HttpException,
  NotFoundException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { Recipient, Prisma } from "@prisma/client";
import { CreateRecipientDto } from "./dto/create-recipient.dto";
import { UpdateRecipientDto } from "./dto/update-recipient.dto";
import { PageParams, PagedResponse } from "../../shared/interfaces";
import { SendInviteDto } from "../recipient/dto/send-invite.dto";
import { Utils } from "../../shared/utils";
import { ResponseData } from "../../shared/interfaces";
import { MailGunService } from "../../shared/services/mailgun.service";
import { SchedulerService } from "../scheduler/scheduler.service";
import { ScheduleSurveyDto } from "./dto/schedule-survey.dto";
// import * as cron from "node-cron";
// import * as csv from "csv-parser";
const csv = require("csv-parser");
import * as XLSX from "xlsx";
import * as fs from "fs";
import { CloudinaryService } from "../../shared/services/cloudinary.service";

interface RecipientData {
  firstname: string;
  lastname: string;
  phoneNumber: number | string | any;
  email: string;
}

@Injectable()
export class RecipientService {
  constructor(
    private prisma: PrismaService,
    private mailGunService: MailGunService,
    private schedulerService: SchedulerService,
    private cloudinaryService: CloudinaryService,

  ) {}

  async addRecipient(data: CreateRecipientDto): Promise<Recipient> {
    const recipient = await this.prisma.recipient.findFirst({
     //where: { email: data?.email },
      where: {
        email: data?.email,
        listId: data?.listId,
      },
    });
    if (recipient) {
      throw new ConflictException("Recipient already exits");
    }
    const list = await this.prisma.list.findFirst({
      where: { id: data?.listId },
    });
    if (!list) {
      throw new ConflictException(
        `list with this id ${data?.listId} doesnt exits`
      );
    }

    return this.prisma.recipient.create({ data });
  }

  async getAllRecipients(params: PageParams): Promise<PagedResponse> {
    const recipientCount = await this.prisma.recipient.aggregate({
      _count: true,
    });

    const filterParams: object = params.q
      ? {
          OR: [
            { firstname: { contains: params.q, mode: "insensitive" } },
            { lastname: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {};

    // set defaults
    params.sortBy = params.sortBy || "id";
    params.sortDir = params.sortDir || "desc";
    params.pageSize = params.pageSize || 10;
    params.pageNumber = params.pageNumber || 1;

    const recipients = await this.prisma.recipient.findMany({
      take: Number(params.pageSize + 1) | 11,
      where: { ...filterParams }, //...dateParams },
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

  async deleteRecipientsByListId(
    listId: string,
    recipientIds: string[]
  ): Promise<Prisma.BatchPayload> {
    const listExists = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!listExists) {
      throw new NotFoundException(`List with ID ${listId} does not exist`);
    }

    return this.prisma.recipient.deleteMany({
      where: {
        listId: listId,
        id: { in: recipientIds },
      },
    });
  }

  async updateRecipient(
    id: string,
    data: UpdateRecipientDto
  ): Promise<Recipient> {
    return this.prisma.recipient.update({
      where: { id },
      data,
    });
  }

  async sendInvites(
    listId: string,
    sendInviteDto: SendInviteDto
  ): Promise<ResponseData> {
    try {
      const list = await this.prisma.list.findUnique({
        where: { id: listId },
        include: { recipients: true },
      });

      if (!list) {
        throw new NotFoundException(`List with ID ${listId} does not exist`);
      }

      // Update the staus of the survey
      await this.prisma.survey.update({
        where: { id: sendInviteDto.surveyId },
        data: { 
          status: "PUBLISHED",
          publishedAt: new Date()
         },
      });

      // const recipientEmails = list.recipients.map(
      //   (recipient: Recipient) => recipient.email
      // );

      const recipientDetails = list.recipients.map((recipient: Recipient) => ({
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

      return Utils.response({
        message: "Invites Sent Successfully",
      });
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async scheduleSurvey(
    listId: string,
    scheduleSurveyDto: ScheduleSurveyDto
  ): Promise<void> {
    //const sendAt = new Date(scheduleSurveyDto.sendAt);
    const sendAt = new Date(scheduleSurveyDto.sendAt).getTime(); // Ensure the time is in milliseconds (UTC)

    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { recipients: true },
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} does not exist`);
    }

    //Update the staus of the survey
    await this.prisma.survey.update({
      where: { id: scheduleSurveyDto.surveyId },
      data: { status: "PUBLISHED" },
    });

    const recipientDetails = list.recipients.map((recipient: Recipient) => ({
      id: recipient.id,
      email: recipient.email,
      firstname: recipient.firstname,
    }));

    // this.schedulerService.scheduleEmail(recipientEmails, subject, text, sendAt);

    //   const job = cron.schedule(new Date(sendAt), async () => {
    //     for (const email of recipientEmails) {
    //       await this.mailGunService.sendEmail(email, subject, text);
    //     }
    //   });
    // }

    // Optionally, store the job reference if you need to manage it later
    // this.jobs.push(job);

    // const currentTime = new Date().getTime();
    // const delay = new Date(sendAt).getTime() - currentTime;

    // if (delay < 0) {
    //   throw new NotFoundException("Scheduled date must be in the future");
    // }

    const currentTime = new Date().getTime(); // Get the current time in milliseconds (UTC)

    const delay = sendAt - currentTime; // Calculate the delay

    if (delay < 0) {
      throw new NotFoundException("Scheduled date must be in the future");
    }

    setTimeout(async () => {
      // console.log(`Sending invite to list ${listId}`);
      for (const recipient of recipientDetails) {
        const subject = `You’ve Been Invited to Take a Survey!`;
        // const text = `Hi! Click on the link to fill the survey: ${scheduleSurveyDto.publishUrl}&recipientsId=${recipients.id}`;
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
      // console.log(`Invite sent to list ${listId}`);
    }, delay);
  }

  async uploadRecipients(listId: string, filePath: string): Promise<void> {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} does not exist`);
    }

    try {
      //  const fileUrl = await this.cloudinaryService.uploadFile(filePath);
      //  console.log(`File uploaded to Cloudinary: ${fileUrl}`);

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const recipients: RecipientData[] = XLSX.utils.sheet_to_json(sheet, {
        header: ["firstname", "lastname", "phoneNumber", "email"],
        range: 1,
      });

      for (const recipient of recipients) {
        if (
          recipient.firstname &&
          recipient.lastname &&
          recipient.phoneNumber &&
          recipient.email
        ) {
          const phoneNumberString =
            recipient.phoneNumber !== null
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
    } catch (error) {
      console.error("Error processing XLSX file:", error);
      throw new BadRequestException("Failed to process XLSX file");
    } finally {
      fs.unlinkSync(filePath); // Remove the temporary file
    }
  }

  async uploadRecipientsCSV(listId: string, filePath: string): Promise<void> {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} does not exist`);
    }

    const fileUrl = await this.cloudinaryService.uploadFile(filePath);
    console.log(`File uploaded to Cloudinary: ${fileUrl}`);

    const recipients: {
      firstname: string;
      lastname: string;
      phoneNumber: string;
      email: string;
    }[] = [];

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) =>
        recipients.push({
          firstname: data.firstname,
          lastname: data.lastname,
          phoneNumber: data.phoneNumber,
          email: data.email,
        })
      )
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
        throw new InternalServerErrorException(
          `Failed to process CSV file: ${error.message}`
        );
      });

    await new Promise<void>((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });
  }
}