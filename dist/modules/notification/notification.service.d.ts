import { PrismaService } from "../../shared/services/prisma.service";
import { MailGunService } from "../../shared/services/mailgun.service";
export declare class NotificationService {
    private prisma;
    private mailGunService;
    constructor(prisma: PrismaService, mailGunService: MailGunService);
    sendTrialNotifications(): Promise<void>;
    subscriptionExpiringMail(): Promise<void>;
    surveyCompletionMail(): Promise<void>;
}
