"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const review_controller_1 = require("./review.controller");
const review_service_1 = require("./review.service");
describe('ReviewController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [review_controller_1.ReviewController],
            providers: [review_service_1.ReviewService],
        }).compile();
        controller = module.get(review_controller_1.ReviewController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=review.controller.spec.js.map