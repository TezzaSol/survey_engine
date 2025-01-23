"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const review_service_1 = require("./review.service");
describe('ReviewService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [review_service_1.ReviewService],
        }).compile();
        service = module.get(review_service_1.ReviewService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=review.service.spec.js.map