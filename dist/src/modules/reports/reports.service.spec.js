"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reports_service_1 = require("./reports.service");
describe('ReportsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [reports_service_1.ReportsService],
        }).compile();
        service = module.get(reports_service_1.ReportsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=reports.service.spec.js.map