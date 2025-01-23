"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const interval_service_1 = require("./interval.service");
describe('IntervalService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [interval_service_1.IntervalService],
        }).compile();
        service = module.get(interval_service_1.IntervalService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=interval.service.spec.js.map