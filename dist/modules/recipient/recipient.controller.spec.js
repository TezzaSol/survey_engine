"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const recipient_controller_1 = require("./recipient.controller");
const recipient_service_1 = require("./recipient.service");
describe('RecipientController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [recipient_controller_1.RecipientController],
            providers: [recipient_service_1.RecipientService],
        }).compile();
        controller = module.get(recipient_controller_1.RecipientController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=recipient.controller.spec.js.map