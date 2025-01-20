import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as cron from "node-cron";
import { MailGunService } from "../../shared/services/mailgun.service";

@Injectable()
export class SchedulerService {
  constructor(private readonly mailGunService: MailGunService) {}

  scheduleEmail(to: string[], subject: string, text: string, date: Date) {
    const job = cron.schedule(
      this.getCronExpression(date),
      async () => {
        for (const email of to) {
          await this.mailGunService.sendEmail(email, subject, text);
        }
        job.stop();
      },
      {
        scheduled: true,
      }
    );
  }

  private getCronExpression(date: Date): string {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = "*";

    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }
}
