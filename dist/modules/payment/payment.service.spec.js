"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payment_service_1 = require("./payment.service");
describe('PaymentService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [payment_service_1.PaymentService],
        }).compile();
        service = module.get(payment_service_1.PaymentService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=payment.service.spec.js.map