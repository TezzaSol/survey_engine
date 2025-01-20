// import { Controller, Post, Body, Req, Res, HttpStatus } from "@nestjs/common";
// import { PaymentService } from "./payment.service";

// @Controller("payment")
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post("initialize")
//   async initializePayment(@Body() { userId, subscriptionPlanId, cycle }: any) {
//     return this.paymentService.createPayment(userId, subscriptionPlanId, cycle);
//   }

//   @Post("webhook")
//   async handleWebhook(@Req() request: any, @Res() response: any) {
//     const verified = await this.paymentService.verifyWebhookSignature(request);
//     if (!verified) {
//       return response.status(HttpStatus.FORBIDDEN).send("Invalid signature");
//     }

//     await this.paymentService.handleWebhook(request.body);
//     return response.status(HttpStatus.OK).send("Webhook received");
//   }
// }
