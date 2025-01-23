"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const shared_module_1 = require("./shared/shared.module");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./common/guards/auth.guard");
const users_module_1 = require("./modules/users/users.module");
const admins_module_1 = require("./modules/admins/admins.module");
const survey_module_1 = require("./modules/survey/survey.module");
const list_module_1 = require("./modules/list/list.module");
const recipient_module_1 = require("./modules/recipient/recipient.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const survey_response_module_1 = require("./modules/survey-response/survey-response.module");
const reports_module_1 = require("./modules/reports/reports.module");
const user_agent_middleware_1 = require("./shared/middlewares/user-agent.middleware");
const notification_module_1 = require("./modules/notification/notification.module");
const login_activities_module_1 = require("./modules/login-activities/login-activities.module");
const payment_module_1 = require("./modules/payment/payment.module");
const task_service_1 = require("./shared/services/task.service");
const integrations_module_1 = require("./modules/integrations/integrations.module");
const platform_module_1 = require("./modules/platform/platform.module");
const review_module_1 = require("./modules/review/review.module");
const auths_module_1 = require("./modules/auths/auths.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(user_agent_middleware_1.UserAgentMiddleware)
            .forRoutes({ path: "*", method: common_1.RequestMethod.ALL });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: "1h", algorithm: "HS512" },
            }),
            auth_module_1.AuthModule,
            shared_module_1.SharedModule,
            users_module_1.UsersModule,
            admins_module_1.AdminsModule,
            survey_module_1.SurveyModule,
            list_module_1.ListModule,
            recipient_module_1.RecipientModule,
            scheduler_module_1.SchedulerModule,
            schedule_1.ScheduleModule.forRoot(),
            survey_response_module_1.SurveyResponseModule,
            reports_module_1.ReportsModule,
            notification_module_1.NotificationModule,
            login_activities_module_1.LoginActivitiesModule,
            payment_module_1.PaymentModule,
            integrations_module_1.IntegrationsModule,
            platform_module_1.PlatformModule,
            review_module_1.ReviewModule,
            auths_module_1.AuthsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            task_service_1.TaskService,
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map