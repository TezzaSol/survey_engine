import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { SendGridService } from "./services/sendgrid.service";
import { MailGunService } from "./services/mailgun.service";
import { CloudinaryService } from "./services/cloudinary.service";
import { GoogleService } from "./services/google.service";

@Global()
@Module({
  providers: [
    PrismaService,
    SendGridService,
    MailGunService,
    CloudinaryService,
    GoogleService,
  ],
  exports: [
    PrismaService,
    SendGridService,
    MailGunService,
    CloudinaryService,
    GoogleService,
  ],
})
export class SharedModule {}
