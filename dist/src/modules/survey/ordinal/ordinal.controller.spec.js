"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ordinal_controller_1 = require("./ordinal.controller");
const ordinal_service_1 = require("./ordinal.service");
describe('OrdinalController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ordinal_controller_1.OrdinalController],
            providers: [ordinal_service_1.OrdinalService],
        }).compile();
        controller = module.get(ordinal_controller_1.OrdinalController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=ordinal.controller.spec.js.map