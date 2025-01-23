"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const login_activities_service_1 = require("./login-activities.service");
describe('LoginActivitiesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [login_activities_service_1.LoginActivitiesService],
        }).compile();
        service = module.get(login_activities_service_1.LoginActivitiesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=login-activities.service.spec.js.map