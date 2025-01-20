import { Injectable } from "@nestjs/common";
import SendGrid from "@sendgrid/mail";

@Injectable()
export class SendGridService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, content: string) {
    const msg = {
      to,
      from: process.env.DEFAULT_MAIL,
      subject,
      text: content,
    };
    await SendGrid.send(msg);
  }
}
