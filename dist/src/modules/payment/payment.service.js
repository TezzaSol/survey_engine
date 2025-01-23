"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mailgun_service_1 = require("../../shared/services/mailgun.service");
const prisma_service_1 = require("../../shared/services/prisma.service");
const utils_1 = require("../../shared/utils");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdf = __importStar(require("html-pdf"));
const Handlebars = __importStar(require("handlebars"));
const strftime_1 = __importDefault(require("strftime"));
const pdfUtils_1 = require("./dtos/pdfUtils");
let PaymentService = class PaymentService {
    constructor(prisma, mailGunService) {
        this.prisma = prisma;
        this.mailGunService = mailGunService;
    }
    async createPaymentDto(userId, createPaymentDto) {
        const { email, amount, transactionId, paymentStatus, txRef, flowRef, chargedAmount, chargeResponseCode, chargeResponseMessage, paymentType, plan, billingCycle, currency, } = createPaymentDto;
        if (parseFloat(createPaymentDto.amount) <= 0) {
            throw new common_1.BadRequestException("Amount must be greater than 0");
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
        const trialStartDate = new Date();
        let trialEndDate;
        if (billingCycle === "Monthly") {
            trialEndDate = new Date(trialStartDate);
            trialEndDate.setMonth(trialEndDate.getMonth() + 1);
            trialEndDate.setDate(0);
        }
        else if (billingCycle === "Yearly") {
            trialEndDate = new Date(trialStartDate);
            trialEndDate.setFullYear(trialEndDate.getFullYear() + 1);
            trialEndDate.setDate(0);
        }
        else {
            throw new common_1.BadRequestException("Invalid billing cycle");
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                trialStartDate,
                trialEndDate,
            },
        });
        return utils_1.Utils.response({
            message: `${plan} Subscription Succesfully Intiated`,
        });
    }
    async findAll() {
        return this.prisma.payment.findMany();
    }
    async findById(id) {
        const payment = await this.prisma.payment.findMany({
            where: { createdById: id },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
    async getTransactionDetailsAsPDF(transactionId, res) {
        const payment = await this.prisma.payment.findUnique({ where: { id: transactionId } });
        if (!payment) {
            throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found`);
        }
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Disposition', 'attachment; filename="transaction-details.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
        doc.fontSize(18).text('Transaction Details', { align: 'center' });
        doc.moveDown(1);
        const columns = ['Transaction ID', 'Amount', 'Payment Status'];
        const data = [
            {
                'Transaction ID': payment.transactionId,
                'Amount': `$${payment.amount}`,
                'Payment Status': payment.paymentStatus,
            },
        ];
        (0, pdfUtils_1.generateTable)(doc, data, columns, {
            startX: 50,
            startY: 150,
            rowHeight: 30,
            columnWidths: [150, 150, 150],
            headerFontSize: 14,
            cellPadding: 8,
        });
        doc.end();
    }
    async transactionDetailsAsPDF(transactionId, res) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: transactionId },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found`);
        }
        const templatePath = path.join(__dirname, "..", "..", "..", "..", "dist", "views", "invoice.hbs");
        const template = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate({
            payment: payment,
            paymentDate: (0, strftime_1.default)("%e %B %Y", payment.createdAt),
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
    async getTransactionDetailsAsPDF2(transactionId, res) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: transactionId },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found`);
        }
        const doc = new pdfkit_1.default();
        res.setHeader("Content-Disposition", 'attachment; filename="transaction-details.pdf"');
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);
        doc
            .fillColor("black")
            .fontSize(18)
            .text("Transaction Details", { align: "center", underline: true });
        doc.moveDown();
        doc.fontSize(12).text("Transaction ID", 100, doc.y);
        doc.text("Amount", 200, doc.y);
        doc.text("Payment Status", 300, doc.y);
        doc.moveDown();
        doc.moveTo(100, doc.y).lineTo(400, doc.y).stroke();
        doc.text(payment.transactionId, 100, doc.y);
        doc.text(payment.amount, 200, doc.y);
        doc.text(payment.paymentStatus, 300, doc.y);
        doc.moveDown();
        doc.rect(50, doc.y, 500, 100).fill("#f0f0f0").stroke();
        doc
            .fillColor("black")
            .text(`Total Charged: ${payment.chargedAmount}`, 60, doc.y + 10);
        doc.text(`Payment Type: ${payment.paymentType}`, 60, doc.y + 30);
        doc.end();
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailGunService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map