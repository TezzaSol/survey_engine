// import { Body, Controller, Post } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import { CreatePaymentDto } from './dtos/create-payment.dto';

// @Controller("payment")
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post("subcribe")
//   async subscription(@Body() createPaymentDto: CreatePaymentDto) {
//     return this.paymentService.subscription(createPaymentDto);
//   }
// }


import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  Request,
  Res,
  Render,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { Response } from "express";
import { Public } from "../../common/decorators/public.decorator";

@Controller("subscription")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Create Payment
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true })) // Enable validation and strip unknown properties
  async createPaymentDto(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    const userId = req.user.sub;
    return this.paymentService.createPaymentDto(userId, createPaymentDto);
  }

  // Fetch All Payments
  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  // Fetch Payment by ID
  @Get(":id")
  // async findById(@Param("id", new ParseUUIDPipe()) id: string) {
  async findById(@Param("id") id: string) {
    return this.paymentService.findById(id);
  }

  // Endpoint to download transaction details as PDF
  @Public()
  @Get(":id/download-pdf")
  async downloadTransactionDetailsAsPDF(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    return this.paymentService.transactionDetailsAsPDF(id, res);
  }
}
