// mail.service.ts
import { Injectable } from "@nestjs/common";
import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import mailgun from "mailgun-js";
import { PrismaService } from "./prisma.service";

@Injectable()
export class MailGunService {
  private mailgun;

  constructor(private readonly prisma: PrismaService) {
    this.mailgun = mailgun({
      apiKey: `${process.env.MAILGUN_API_KEY}`,
      domain: `${process.env.MAILGUN_DOMAIN}`,
    });
  }

  async sendTrialEndingNotification(email: string, daysLeft: number) {
    // const subject = `Your free trial ends in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    const appName = process.env.APP_NAME;
    const subject = "Your free trial is about to end";
    const message = `Dear User, your free trial will end in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Please subscribe to continue using the service.`;
    const templateName = "trial-ending";
    const subscriptionUrl = `${process.env.WEBSITE_URL}/subscription/${user.id}`;
    const context = {
      user: user.firstname || "there",
      daysLeft,
      appName,
      subscriptionUrl,
    };

    await this.sendEmailWithTemplate({
      to: email,
      subject,
      templateName,
      context,
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const data = {
      from: `Tezza Business Solutions - ${process.env.DEFAULT_MAILER}`,
      to,
      subject,
      html,
    };

    return this.mailgun.messages().send(data);
    //await this.mailgun.messages().send(data);
  }

  async sendEmailWithTemplate(arg: {
    to: string;
    subject: string;
    templateName: string;
    context: object;
  }) {
    const template = this.loadTemplate(arg.templateName);
    const html = this.renderTemplate(template, arg.context);

    const data = {
      from: `Tezza Business Solutions - ${process.env.DEFAULT_MAILER}`,
      to: arg.to,
      subject: arg.subject,
      html,
    };

    return this.mailgun.messages().send(data);
    //await this.mailgun.messages().send(data);
  }

  // private loadTemplate(templateName: string): string {

  //   // Function to convert 'dist' path to 'src' path
  //   function convertDistPathToSrcPath(distPath) {
  //     const distDir = path.join("dist");
  //     const srcDir = "src";
  //     return distPath.replace(distDir, srcDir);
  //   }

  //   // Get the current directory (__dirname)
  //   const distPath = __dirname;

  //   // Convert the dist path to src path
  //   const srcPath = convertDistPathToSrcPath(distPath);
  //   const templatePath = path.join(
  //     srcPath,
  //     "../../../templates/signup",
  //     `${templateName}.hbs`
  //   );

  //   console.log(templatePath);

  //   return fs.readFileSync(templatePath, "utf-8");
  // }

  // private loadTemplate(templateName: string): string {
  //   // Function to check if a file exists
  //   const fileExists = (filePath: string) => {
  //     try {
  //       return fs.existsSync(filePath);
  //     } catch (err) {
  //       return false;
  //     }
  //   };

  //   // Paths for production and development
  //   const distTemplatePath = path.join(
  //     __dirname,
  //     "../../../templates/signup",
  //     `${templateName}.hbs`
  //   );
  //   const srcTemplatePath = path.join(
  //     __dirname,
  //     "../../../../src/templates/signup",
  //     `${templateName}.hbs`
  //   );

  //   // Determine which path to use
  //   const templatePath = fileExists(distTemplatePath)
  //     ? distTemplatePath
  //     : srcTemplatePath;

  //   // Ensure the template path exists
  //   if (!fileExists(templatePath)) {
  //     throw new Error(`Template not found: ${templatePath}`);
  //   }

  //   console.log(`Using template path: ${templatePath}`);
  //   return fs.readFileSync(templatePath, "utf-8");
  // }

  // private loadTemplate(templateName: string): string {
  //   const templateDir = process.env.TEMPLATE_DIR;
  //   const templatePath = path.join(
  //     templateDir,
  //     "signup",
  //     `${templateName}.hbs`
  //   );

  //   if (!fs.existsSync(templatePath)) {
  //     throw new Error(`Template not found: ${templatePath}`);
  //   }

  //   console.log(`Using template path: ${templatePath}`);
  //   return fs.readFileSync(templatePath, "utf-8");
  // }

  private loadTemplate(templateName: string): string {
    // const templateDir =
    //   process.env.TEMPLATE_DIR ||
    //   path.resolve(__dirname, "../../../src/templates");

    const templateDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "dist",
      "views",
      "mailer",
    );

    console.log(`Template directory: ${templateDir}`); // Log the template directory
    const templatePath = path.join(templateDir, `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    console.log(`Using template path: ${templatePath}`);
    return fs.readFileSync(templatePath, "utf-8");
  }

  private renderTemplate(template: string, context: object): string {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(context);
  }
}
