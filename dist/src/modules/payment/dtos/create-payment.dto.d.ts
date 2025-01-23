import { BillingCycle } from "@prisma/client";
export declare class CreatePaymentDto {
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
    billingCycle: BillingCycle;
    isActive: Boolean;
}
