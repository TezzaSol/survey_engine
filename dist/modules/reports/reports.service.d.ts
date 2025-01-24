import { PrismaService } from "../../shared/services/prisma.service";
import { FilterSurveysDto } from "./dto/filter-surveys.dto";
export interface ReportParam {
    startDate?: string;
    endDate?: string;
    surveyType?: string;
}
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSurveyStatistics(filterSurveysDto: FilterSurveysDto): Promise<{
        data: {
            totalSurveysSent: number;
            totalSurveysDraft: number;
            totalSurveysPublished: number;
            totalSurveysActive: number;
            totalSurveysClosed: number;
            totalResponses: number;
            responseRate: number;
        };
    }>;
    reports(userId: string, reportParam: ReportParam): Promise<{
        meta: {
            startDate: string;
            endDate: string;
            surveyType: string;
            percentageResponseRate: number;
            totalResponseCount: number;
            totalSurveys: number;
            totalSurveySent: number;
            mobile: number;
            web: number;
        };
        NpsAggregate: {
            promoters: number;
            passives: number;
            detractors: number;
            percentagePromoters: number;
            percentageDetractors: number;
            percentagePassives: number;
            nps: number;
        };
        surveysByTemplate: {
            ordinalSurveys: number;
            ratioSurveys: number;
            hybridSurveys: number;
            intervalSurveys: number;
        };
        surveysByStatus: {
            publishedSurveys: number;
            draftSurveys: number;
            activeSurveys: number;
            closedSurveys: number;
        };
        surveyResponses: object[];
        monthlyNpsAggregates: {
            month: any;
            year: any;
            promoters: any;
            passives: any;
            detractors: any;
            totalResponses: any;
            percentagePromoters: number;
            percentagePassives: number;
            percentageDetractors: number;
            nps: number;
        }[];
        surveyTrendAnalysis: {
            month: number;
            totalResponses: number;
            totalPublished: number;
        }[];
        responseRateData: {
            name: string;
            Completed: number;
            Incompleted: number;
        }[];
    }>;
    reportsOptimized(reportParam: ReportParam, deviceType: any): Promise<{
        meta: {
            startDate: string;
            endDate: string;
            surveyType: string;
            percentageResponseRate: number;
            totalResponseCount: number;
            totalSurveys: number;
            mobile: number;
            web: number;
        };
        NpsAggregate: {
            promoters: number;
            passives: number;
            detractors: number;
            percentagePromoters: number;
            percentagePassives: number;
            percentageDetractors: number;
            nps: number;
        };
        surveyTrendAnalysis: {
            month: number;
            totalResponses: number;
            totalPublished: number;
        }[];
        responseRateData: {
            name: string;
            Completed: number;
            Incompleted: number;
        }[];
    }>;
}
