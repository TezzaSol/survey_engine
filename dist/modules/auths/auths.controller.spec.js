"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auths_controller_1 = require("./auths.controller");
const auths_service_1 = require("./auths.service");
describe('AuthsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auths_controller_1.AuthsController],
            providers: [auths_service_1.AuthsService],
        }).compile();
        controller = module.get(auths_controller_1.AuthsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=auths.controller.spec.js.map