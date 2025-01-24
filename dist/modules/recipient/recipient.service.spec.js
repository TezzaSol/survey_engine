"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const recipient_service_1 = require("./recipient.service");
describe('RecipientService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [recipient_service_1.RecipientService],
        }).compile();
        service = module.get(recipient_service_1.RecipientService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=recipient.service.spec.js.map