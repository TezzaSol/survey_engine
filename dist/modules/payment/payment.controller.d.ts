import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { Response } from "express";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPaymentDto(req: any, createPaymentDto: CreatePaymentDto): Promise<import("../../shared/interfaces").ResponseData>;
    findAll(): Promise<{
        id: string;
        email: string;
        amount: string;
        transactionId: string;
        paymentStatus: string;
        txRef: string;
        flowRef: string;
        chargedAmount: string;
        chargeResponseCode: string;
        chargeResponseMessage: string;
        currency: string;
        paymentType: string;
        plan: string;
        isActive: boolean;
        billingCycle: import(".prisma/client").$Enums.BillingCycle;
        createdById: string;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        amount: string;
        transactionId: string;
        paymentStatus: string;
        txRef: string;
        flowRef: string;
        chargedAmount: string;
        chargeResponseCode: string;
        chargeResponseMessage: string;
        currency: string;
        paymentType: string;
        plan: string;
        isActive: boolean;
        billingCycle: import(".prisma/client").$Enums.BillingCycle;
        createdById: string;
        createdAt: Date;
    }[]>;
    downloadTransactionDetailsAsPDF(id: string, res: Response): Promise<void>;
}
