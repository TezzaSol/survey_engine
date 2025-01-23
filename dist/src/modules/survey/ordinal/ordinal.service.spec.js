"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ordinal_service_1 = require("./ordinal.service");
describe('OrdinalService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [ordinal_service_1.OrdinalService],
        }).compile();
        service = module.get(ordinal_service_1.OrdinalService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=ordinal.service.spec.js.map