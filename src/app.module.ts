import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guards/auth.guard";
import { UsersModule } from "./modules/users/users.module";
import { AdminsModule } from "./modules/admins/admins.module";
import { SurveyModule } from "./modules/survey/survey.module";
import { ListModule } from "./modules/list/list.module";
import { RecipientModule } from "./modules/recipient/recipient.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { SurveyResponseModule } from "./modules/survey-response/survey-response.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { UserAgentMiddleware } from "./shared/middlewares/user-agent.middleware";
import { NotificationModule } from "./modules/notification/notification.module";
import { LoginActivitiesModule } from "./modules/login-activities/login-activities.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { TaskService } from "./shared/services/task.service";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { PlatformModule } from "./modules/platform/platform.module";
import { ReviewModule } from "./modules/review/review.module";
import { AuthsModule } from "./modules/auths/auths.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h", algorithm: "HS512" },
    }),
    AuthModule,
    SharedModule,
    UsersModule,
    AdminsModule,
    SurveyModule,
    ListModule,
    RecipientModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    SurveyResponseModule,
    ReportsModule,
    NotificationModule,
    LoginActivitiesModule,
    PaymentModule,
    IntegrationsModule,
    PlatformModule,
    ReviewModule,
    AuthsModule,
  ],
  controllers: [AppController],
  providers: [
    TaskService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAgentMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
