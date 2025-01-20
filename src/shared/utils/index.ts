import { ResponseData } from "../interfaces";
import { UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { MailGunService } from "../services/mailgun.service";
import * as jwt from "jsonwebtoken";

export class Utils {
  constructor(
    private prisma: PrismaService,
    public jwtService: JwtService,
    private mailGunService: MailGunService
  ) {}

  static response(data: Partial<ResponseData>): ResponseData {
    return {
      message: "data fetched",
      success: true,
      //status: 200,
      data: null,
      meta: null,
      ...data,
    };
  }

  static unixTimestamp() {
    return Math.floor(Date.now() / 100);
  }

  private async sendResetPasswordEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException("invalid email address");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const resetLink = `${process.env.WEBSITE_URL}/reset-password/?token=${token}`;

    // Send reset password email
    const subject = "Reset your password";
    const html = `Click on the link to reset your password: ${resetLink}`;
    await this.mailGunService.sendEmail(email, subject, html);

    return Utils.response({
      message: `password reset link with instructions has been sent to '${email}`,
    });
  }

  static checkEntityExists<T>(
    entity: T | null,
    id: string,
    entityName: string
  ) {
    if (!entity) {
      throw new NotFoundException(`${entityName} with id ${id} not found`);
    }
    return entity;
  }
}


