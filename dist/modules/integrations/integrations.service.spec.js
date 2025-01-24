"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const integrations_service_1 = require("./integrations.service");
describe('IntegrationsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [integrations_service_1.IntegrationsService],
        }).compile();
        service = module.get(integrations_service_1.IntegrationsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=integrations.service.spec.js.map