import { Controller, Get, Query, Request } from "@nestjs/common";
import { ReportsService, ReportParam } from "./reports.service";
import { FilterSurveysDto } from "./dto/filter-surveys.dto";
import * as useragent from "express-useragent";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("statistics")
  async getSurveyStatistics(@Query() filterSurveysDto: FilterSurveysDto) {
    return this.reportsService.getSurveyStatistics(filterSurveysDto);
  }

  @Get()
  async getReports(
      @Request() req,
     @Query() reportParam: ReportParam) {
          const userId = req.user?.sub; 
      // const deviceType = useragent.parse(req.headers["user-agent"]).isMobile
      //   ? "mobile"
      //   : "web";
      // console.log("Device Type Is - ", deviceType)
    return this.reportsService.reports(userId, reportParam);
  }
}
