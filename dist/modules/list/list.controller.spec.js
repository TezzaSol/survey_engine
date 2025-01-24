"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const list_controller_1 = require("./list.controller");
const list_service_1 = require("./list.service");
describe('ListController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [list_controller_1.ListController],
            providers: [list_service_1.ListService],
        }).compile();
        controller = module.get(list_controller_1.ListController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=list.controller.spec.js.map