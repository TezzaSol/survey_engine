"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const platform_controller_1 = require("./platform.controller");
const platform_service_1 = require("./platform.service");
describe('PlatformController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [platform_controller_1.PlatformController],
            providers: [platform_service_1.PlatformService],
        }).compile();
        controller = module.get(platform_controller_1.PlatformController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=platform.controller.spec.js.map