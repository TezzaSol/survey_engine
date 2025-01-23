"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const admins_controller_1 = require("./admins.controller");
const admins_service_1 = require("./admins.service");
describe('AdminsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [admins_controller_1.AdminsController],
            providers: [admins_service_1.AdminsService],
        }).compile();
        controller = module.get(admins_controller_1.AdminsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=admins.controller.spec.js.map