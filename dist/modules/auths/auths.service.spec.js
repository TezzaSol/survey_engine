"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auths_service_1 = require("./auths.service");
describe('AuthsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [auths_service_1.AuthsService],
        }).compile();
        service = module.get(auths_service_1.AuthsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=auths.service.spec.js.map