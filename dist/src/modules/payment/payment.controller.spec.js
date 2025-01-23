"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
describe('PaymentController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [payment_controller_1.PaymentController],
            providers: [payment_service_1.PaymentService],
        }).compile();
        controller = module.get(payment_controller_1.PaymentController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=payment.controller.spec.js.map