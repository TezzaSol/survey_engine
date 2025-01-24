import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  Patch,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { RecipientService } from "./recipient.service";
import { Prisma, Recipient } from "@prisma/client";
import { CreateRecipientDto } from "./dto/create-recipient.dto";
import { UpdateRecipientDto } from "./dto/update-recipient.dto";
import { PageParams, PagedResponse } from "../../shared/interfaces";
import { SendInviteDto } from "./dto/send-invite.dto";
import { ScheduleSurveyDto } from "./dto/schedule-survey.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("recipients")
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Post()
  addRecipient(
    @Body() createRecipientDto: CreateRecipientDto
  ): Promise<Recipient> {
    return this.recipientService.addRecipient(createRecipientDto);
  }

  @Get()
  async findAll(@Query() params: PageParams): Promise<PagedResponse> {
    return await this.recipientService.getAllRecipients(params);
  }

  @Patch(":id")
  updateRecipient(
    @Param("id") id: string,
    @Body() updateRecipientDto: UpdateRecipientDto
  ): Promise<Recipient> {
    return this.recipientService.updateRecipient(id, updateRecipientDto);
  }

  @HttpCode(204)
  @Delete(":listId")
  deleteRecipientsByListId(
    @Query("recipientIds") recipientIds: string,
    @Param("listId") listId: string
  ): Promise<Prisma.BatchPayload> {
    const recipientIddArray = recipientIds.split(",");
    return this.recipientService.deleteRecipientsByListId(
      listId,
      recipientIddArray
    );
  }

  @Post(":id/send-invites")
  async sendInvites(
    @Param("id") listId: string,
    @Body() sendInviteDto: SendInviteDto
  ): Promise<void> {
    await this.recipientService.sendInvites(listId, sendInviteDto);
  }

  @Post(":id/schedule-survey")
  async scheduleSurvey(
    @Param("id") listId: string,
    @Body() scheduleSurveyDto: ScheduleSurveyDto
  ): Promise<void> {
    await this.recipientService.scheduleSurvey(listId, scheduleSurveyDto);
  }

  @Post(":id/import-recipients")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return callback(
            new BadRequestException("Only XLSX and XLS files are allowed!"),
            false
          );
        }
        callback(null, true);
      },
    })
  )
  async uploadRecipients(
    @Param("id") listId: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    await this.recipientService.uploadRecipients(listId, file.path);
  }
}