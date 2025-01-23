"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const interval_controller_1 = require("./interval.controller");
const interval_service_1 = require("./interval.service");
describe('IntervalController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [interval_controller_1.IntervalController],
            providers: [interval_service_1.IntervalService],
        }).compile();
        controller = module.get(interval_controller_1.IntervalController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=interval.controller.spec.js.map