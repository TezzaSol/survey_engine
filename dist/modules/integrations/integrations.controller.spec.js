"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const integrations_controller_1 = require("./integrations.controller");
const integrations_service_1 = require("./integrations.service");
describe('IntegrationsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [integrations_controller_1.IntegrationsController],
            providers: [integrations_service_1.IntegrationsService],
        }).compile();
        controller = module.get(integrations_controller_1.IntegrationsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=integrations.controller.spec.js.map