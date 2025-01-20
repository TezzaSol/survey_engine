



// import { Module } from "@nestjs/common";
// import { PaymentService } from "./payment.service";
// import { PaymentController } from "./payment.controller";
// import { ScheduleModule } from "@nestjs/schedule";
// import { PrismaService } from "../prisma/prisma.service";

// @Module({
//   imports: [ScheduleModule.forRoot()],
//   providers: [PaymentService, PrismaService],
//   controllers: [PaymentController],
// })
// export class PaymentModule {}

import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}