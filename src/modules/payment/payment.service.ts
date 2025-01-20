import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MailGunService } from '../../shared/services/mailgun.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { Utils } from '../../shared/utils';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { ResponseData } from '../../shared/interfaces';
import PDFDocument from "pdfkit";
import { Response } from "express";
import * as fs from "fs";
import * as path from "path";
import * as hbs from "hbs";
import * as pdf from "html-pdf";
import { resolve } from "path";
import * as Handlebars from "handlebars";
import strftime from "strftime";
import { generateTable } from './dtos/pdfUtils'

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private mailGunService: MailGunService
  ) {}
  async createPaymentDto(
    userId: string,
    createPaymentDto: CreatePaymentDto
  ): Promise<ResponseData> {
    // Optional: add custom validation logic if needed before creating the payment
    const {
      email,
      amount,
      transactionId,
      paymentStatus,
      txRef,
      flowRef,
      chargedAmount,
      chargeResponseCode,
      chargeResponseMessage,
      paymentType,
      plan,
      billingCycle,
      currency,
    } = createPaymentDto;
    if (parseFloat(createPaymentDto.amount) <= 0) {
      throw new BadRequestException("Amount must be greater than 0");
    }
    const payment = await this.prisma.payment.create({
      data: {
        email,
        amount,
        transactionId,
        paymentStatus,
        txRef,
        flowRef,
        chargedAmount,
        chargeResponseCode,
        chargeResponseMessage,
        paymentType,
        plan,
        billingCycle,
        currency,
        createdById: userId,
      },
    });

    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    const subject = "Payment Successful for Your Subscription";
    const templateName = "payment-confirmation";
    const context = {
      appName: process.env.APP_NAME,
      user: user?.firstname || "there",
      subscriptionPlan: plan,
    };
    await this.mailGunService.sendEmailWithTemplate({
      to: email,
      subject,
      templateName,
      context,
    });

    // Determine the trial period based on the billing cycle
    // const trialPeriodDays = billingCycle === "Monthly" ? 30 : 365;
    // const trialEndDate = new Date();
    // trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);

    // Set trialStartDate to the current date
    const trialStartDate = new Date();

    // Calculate the trial end date based on billing cycle
    let trialEndDate: Date;
    if (billingCycle === "Monthly") {
      trialEndDate = new Date(trialStartDate);
      trialEndDate.setMonth(trialEndDate.getMonth() + 1); // Add one month
      trialEndDate.setDate(0); // Set to the last day of the previous month
    } else if (billingCycle === "Yearly") {
      trialEndDate = new Date(trialStartDate);
      trialEndDate.setFullYear(trialEndDate.getFullYear() + 1); // Add one year
      trialEndDate.setDate(0); // Set to the last day of the previous month
    } else {
      throw new BadRequestException("Invalid billing cycle");
    }

    // Update the user's trialStartDate with the current datetime
    await this.prisma.user.update({
      where: { id: userId }, //if monthly change plan to 3odays els
      data: {
        trialStartDate,
        trialEndDate,
      },
    });

    return Utils.response({
      message: `${plan} Subscription Succesfully Intiated`,
    });
  }

  async findAll() {
    return this.prisma.payment.findMany();
  }

  async findById(id: string) {
    const payment = await this.prisma.payment.findMany({
      where: { createdById: id },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }


// Function to generate a table in PDF


async getTransactionDetailsAsPDF(transactionId: string, res: Response) {
  const payment = await this.prisma.payment.findUnique({ where: { id: transactionId } });

  if (!payment) {
    throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename="transaction-details.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  // Title
  doc.fontSize(18).text('Transaction Details', { align: 'center' });
  doc.moveDown(1);

  // Table Columns
  const columns = ['Transaction ID', 'Amount', 'Payment Status'];

  // Table Data
  const data = [
    {
      'Transaction ID': payment.transactionId,
      'Amount': `$${payment.amount}`,
      'Payment Status': payment.paymentStatus,
    },
  ];

  // Draw the styled table
  generateTable(doc, data, columns, {
    startX: 50,
    startY: 150,
    rowHeight: 30,
    columnWidths: [150, 150, 150],
    headerFontSize: 14,
    cellPadding: 8,
  });

  //Finalize the PDF
  doc.end();
}


  async transactionDetailsAsPDF(transactionId: string, res: Response) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: transactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`
      );
    }

    const templatePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "dist",
      "views",
      "invoice.hbs"
    );

    const template = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(template);

    const html = compiledTemplate({
      payment: payment,
      paymentDate: strftime("%e %B %Y", payment.createdAt),
    });

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "5mm",
    };

    pdf.create(html, options).toStream((err, stream) => {
      if (err) {
        return res.status(500).send("Error generating PDF");
      }

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=transaction_${transactionId}.pdf`,
      });

      stream.pipe(res);
    });
  }

  async getTransactionDetailsAsPDF2(transactionId: string, res: Response) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: transactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`
      );
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transaction-details.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Add a logo
    //doc.image("path/to/logo.png", { fit: [50, 50], align: "center" });

    // Add title with underline and color
    doc
      .fillColor("black")
      .fontSize(18)
      .text("Transaction Details", { align: "center", underline: true });

    doc.moveDown(); // Add space

    // Create table-like structure with headers
    doc.fontSize(12).text("Transaction ID", 100, doc.y);
    doc.text("Amount", 200, doc.y);
    doc.text("Payment Status", 300, doc.y);
    doc.moveDown();

    // Draw a line below headers
    doc.moveTo(100, doc.y).lineTo(400, doc.y).stroke();

    // Add transaction details
    doc.text(payment.transactionId, 100, doc.y);
    doc.text(payment.amount, 200, doc.y);
    doc.text(payment.paymentStatus, 300, doc.y);

    doc.moveDown(); // Space between sections

    // Add payment summary in a colored box
    doc.rect(50, doc.y, 500, 100).fill("#f0f0f0").stroke();
    doc
      .fillColor("black")
      .text(`Total Charged: ${payment.chargedAmount}`, 60, doc.y + 10);
    doc.text(`Payment Type: ${payment.paymentType}`, 60, doc.y + 30);

    // End and send the PDF
    doc.end();
  }
}
