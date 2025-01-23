"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const admins_service_1 = require("./admins.service");
describe('AdminsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [admins_service_1.AdminsService],
        }).compile();
        service = module.get(admins_service_1.AdminsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=admins.service.spec.js.map