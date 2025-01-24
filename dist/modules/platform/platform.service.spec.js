"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const platform_service_1 = require("./platform.service");
describe('PlatformService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [platform_service_1.PlatformService],
        }).compile();
        service = module.get(platform_service_1.PlatformService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=platform.service.spec.js.map