import { MailGunService } from "../../shared/services/mailgun.service";
export declare class SchedulerService {
    private readonly mailGunService;
    constructor(mailGunService: MailGunService);
    scheduleEmail(to: string[], subject: string, text: string, date: Date): void;
    private getCronExpression;
}
