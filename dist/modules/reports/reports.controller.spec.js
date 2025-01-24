"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
describe('ReportsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [reports_controller_1.ReportsController],
            providers: [reports_service_1.ReportsService],
        }).compile();
        controller = module.get(reports_controller_1.ReportsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=reports.controller.spec.js.map