import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  Request,
  Query,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { SurveyService, SurveyQuery } from "./survey.service";
import { CreateSurveyDto } from "./dtos/create-survey.dto";
import { UpdateSurveyDto } from "./dtos/update-survey.dto";
// import { RolesGuard } from "../../common/guards/role.guard";
import { UserRole } from "../../shared/enums/user-role.enum";
import { Roles } from "../../common/decorators/role.decorator";
import { ResponseData } from "../../shared/interfaces";
import { Public } from "../../common/decorators/public.decorator";
import { UpdateSurveyStatus } from "./dtos/update-survey-status.dto";


@Controller("surveys")
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}
  @Roles(UserRole.Admin) // Only admins can access this endpoin
  @Post()
  async createSurvey(
    @Body() createSurveyDto: CreateSurveyDto,
    @Request() req
  ): Promise<ResponseData> {
    const userId = req.user.sub;
    return this.surveyService.createSurvey(createSurveyDto, userId);
  }

  @Roles(UserRole.Admin) // Only admins can access this endpoint
  @Get()
  async getAllSurveys(
    @Query() params: SurveyQuery,
    @Request() req
  ): Promise<CreateSurveyDto[]> {
    const userId = req.user?.sub;

    return this.surveyService.getAllSurveys(
      {
        search: params.q,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
        startDate: params.startDate,
        endDate: params.endDate,
      },
      userId // Pass the userId to the service
    );
  }

  @Get()
  async getAllSurveys1() {
    return this.surveyService.getAllSurveys1();
  }

  @Public()
  @Get(":id")
  async getSurveyById(@Param("id") id: string) {
    return this.surveyService.getSurveyById(id);
  }

  @Roles(UserRole.Admin) // Only admins can access this endpoint
  @Put(":id")
  update(@Param("id") id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.updateSurvey(id, updateSurveyDto);
  }
  // @Put(":id")
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateSurvey(
  //   @Param("id") id: string,
  //   @Body() updateSurveyDto: UpdateSurveyDto,
  // ) {
  //   return this.surveyService.updateSurvey(id, updateSurveyDto);
  // }

  @Roles(UserRole.Admin) // Only admins can access this endpoint
  @Patch("update-status/:surveyId")
  async updateSurveyStatus(
    @Param("surveyId") surveyId: string,
    @Body() updateSurveyStatus: UpdateSurveyStatus
  ) {
    return this.surveyService.updateSurveyStatus(surveyId, updateSurveyStatus);
  }

  @Roles(UserRole.Admin) // Only admins can access this endpoint
  @HttpCode(204)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.surveyService.deleteSurvey(id);
  }
}