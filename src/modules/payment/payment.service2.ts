// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "../prisma/prisma.service";
// import { Flutterwave } from "flutterwave-node-v3";
// import { Cron, CronExpression } from "@nestjs/schedule";
// import * as crypto from "crypto";

// @Injectable()
// export class PaymentService {
//   private flw: Flutterwave;
//   private readonly logger = new Logger(PaymentService.name);

//   constructor(private prisma: PrismaService) {
//     this.flw = new Flutterwave(
//       process.env.FLW_PUBLIC_KEY,
//       process.env.FLW_SECRET_KEY
//     );
//   }

//   // Initialize payment for a subscription
//   async createPayment(
//     userId: string,
//     subscriptionPlanId: string,
//     cycle: "MONTHLY" | "YEARLY"
//   ) {
//     const plan = await this.prisma.subscriptionPlan.findUnique({
//       where: { id: subscriptionPlanId },
//     });
//     const amount = cycle === "MONTHLY" ? plan.monthlyPrice : plan.yearlyPrice;

//     const payment = await this.prisma.payment.create({
//       data: {
//         userId,
//         amount,
//         status: "PENDING",
//       },
//     });

//     const transaction = await this.flw.Payment.initialize({
//       amount,
//       currency: "USD",
//       customer: {
//         email: "user@example.com",
//         phonenumber: "1234567890",
//         name: "User Name",
//       },
//       tx_ref: payment.id,
//       redirect_url: "http://localhost:3000/payment/callback",
//     });

//     return transaction;
//   }

//   // Handle automatic recurring charges
//   async chargeSubscription(subscriptionId: string) {
//     const subscription = await this.prisma.subscription.findUnique({
//       where: { id: subscriptionId },
//       include: { plan: true, user: true },
//     });

//     if (!subscription) {
//       this.logger.warn(`Subscription ${subscriptionId} not found.`);
//       return;
//     }

//     const amount =
//       subscription.cycle === "MONTHLY"
//         ? subscription.plan.monthlyPrice
//         : subscription.plan.yearlyPrice;

//     const payment = await this.prisma.payment.create({
//       data: {
//         userId: subscription.userId,
//         amount,
//         status: "PENDING",
//       },
//     });

//     const transaction = await this.flw.Payment.initialize({
//       amount,
//       currency: "USD",
//       customer: {
//         email: subscription.user.email,
//         phonenumber: "1234567890",
//         name: `${subscription.user.firstName} ${subscription.user.lastName}`,
//       },
//       tx_ref: payment.id,
//       redirect_url: "http://localhost:3000/payment/callback",
//     });

//     if (transaction.status === "success") {
//       await this.prisma.subscription.update({
//         where: { id: subscriptionId },
//         data: { lastBilledAt: new Date() },
//       });
//       this.logger.log(`Subscription ${subscriptionId} charged successfully.`);
//     }
//   }

//   // Cron job for automatic recurring charges
//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   async handleRecurringCharges() {
//     this.logger.log("Running daily subscription check for renewals...");

//     const dueSubscriptions = await this.prisma.subscription.findMany({
//       where: {
//         endDate: { lte: new Date() },
//         active: true,
//       },
//     });

//     for (const subscription of dueSubscriptions) {
//       await this.chargeSubscription(subscription.id);
//     }
//   }

//   // Verify webhook signature
//   async verifyWebhookSignature(request: any): Promise<boolean> {
//     const hash = request.headers["verif-hash"];
//     if (!hash) {
//       this.logger.warn("No verification hash found in headers.");
//       return false;
//     }

//     const secretHash = process.env.FLW_SECRET_HASH;
//     const computedHash = crypto
//       .createHmac("sha256", secretHash)
//       .update(JSON.stringify(request.body))
//       .digest("hex");

//     return hash === computedHash;
//   }

//   // Handle webhook event
//   async handleWebhook(payload: any) {
//     const { status, tx_ref, amount } = payload.data;

//     const payment = await this.prisma.payment.update({
//       where: { reference: tx_ref },
//       data: {
//         status: status === "successful" ? "SUCCESS" : "FAILED",
//         amount,
//       },
//     });

//     if (status === "successful") {
//       const subscription = await this.prisma.subscription.findUnique({
//         where: { userId: payment.userId },
//       });
//       const newEndDate = this.calculateNewEndDate(
//         subscription.cycle,
//         subscription.endDate
//       );

//       await this.prisma.subscription.update({
//         where: { id: subscription.id },
//         data: {
//           endDate: newEndDate,
//           lastBilledAt: new Date(),
//         },
//       });

//       this.logger.log(
//         `Subscription for user ${payment.userId} renewed successfully.`
//       );
//     } else {
//       this.logger.warn(`Payment for reference ${tx_ref} failed.`);
//     }
//   }

//   private calculateNewEndDate(
//     cycle: "MONTHLY" | "YEARLY",
//     currentEndDate: Date
//   ): Date {
//     const endDate = new Date(currentEndDate);
//     return cycle === "MONTHLY"
//       ? new Date(endDate.setMonth(endDate.getMonth() + 1))
//       : new Date(endDate.setFullYear(endDate.getFullYear() + 1));
//   }
// }
