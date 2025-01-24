import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Delete,
  Param,
} from "@nestjs/common";
import { SurveyResponseService } from "./survey-response.service";
import { Public } from "../../common/decorators/public.decorator";
import { CreateSurveyResponsesDto } from "./dto/create-survey-responses.dto";
import { Roles } from "../../common/decorators/role.decorator";
import { UserRole } from "../../shared/enums/user-role.enum";
import { PageParams, PagedResponse } from "../../shared/interfaces";
import * as useragent from "express-useragent";

@Controller("survey-response")
export class SurveyResponseController {
  constructor(private readonly surveyResponseService: SurveyResponseService) {}

  @Public()
  @Post()
  async createResponses(
    @Request() req,
    @Body() createSurveyResponsesDto: CreateSurveyResponsesDto
  ) {
    const deviceType = useragent.parse(req.headers["user-agent"]).isMobile
      ? "mobile"
      : "web";
    console.log("Device Type Is - ", deviceType);
    return this.surveyResponseService.createResponses(deviceType, createSurveyResponsesDto);
  }

  @Get()
  async getAllSurveyResponses() {
    return await this.surveyResponseService.getAllSurveyResponses();
  }

  // @Roles(UserRole.Admin) // Only admins can access this endpoin
  // @Get(":recipientId")
  // async getRecipientDataAndResponses(
  //   @Param("recipientId") recipientId: string
  // ) {
  //   return this.surveyResponseService.getRecipientDataAndResponses(recipientId);
  // }

  @Roles(UserRole.Admin) // Only admins can access this endpoi
  @Delete(":recipientId")
  async deleteResponses(
    @Param("recipientId") recipientId: string,
    @Body("responseIds") responseIds: string[]
  ) {
    return this.surveyResponseService.deleteRecipientsResponses(
      recipientId,
      responseIds
    );
  }

  @Roles(UserRole.Admin) // Only admins can access this endpoi
  @Post("delete-multiple-recipients-responses")
  async deleteResponsesForRecipients(
    @Body()
    body: {
      recipientData: { recipientId: string; responseIds: string[] }[];
    }
  ) {
    return this.surveyResponseService.deleteResponsesForRecipients(
      body.recipientData
    );
  }

  @Roles(UserRole.Admin)
  @Get(":surveyId/analysis")
  async responseAnalysis(@Param("surveyId") surveyId: string) {
    return this.surveyResponseService.analyzeResponses(surveyId);
  }

  // @Roles(UserRole.Admin)
  // @Get(":surveyId")
  // async getResponses(
  //   @Param("surveyId") surveyId: string,
  //   @Query() params: PageParams
  // ): Promise<PagedResponse> {
  //   // return await this.surveyResponseService.getResponses(surveyId, params);
  //   return await this.surveyResponseService.getResponses(surveyId, params);
  // }

  @Roles(UserRole.Admin)
  @Get(":surveyId")
  async getSurveyWithResponses(@Param("surveyId") surveyId: string) {
    // return await this.surveyResponseService.getResponses(surveyId, params);
    return await this.surveyResponseService.getSurveyWithResponses(surveyId);
  }
}
