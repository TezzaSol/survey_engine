"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const login_activities_controller_1 = require("./login-activities.controller");
const login_activities_service_1 = require("./login-activities.service");
describe('LoginActivitiesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [login_activities_controller_1.LoginActivitiesController],
            providers: [login_activities_service_1.LoginActivitiesService],
        }).compile();
        controller = module.get(login_activities_controller_1.LoginActivitiesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=login-activities.controller.spec.js.map