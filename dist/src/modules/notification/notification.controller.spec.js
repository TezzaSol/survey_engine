"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const notification_controller_1 = require("./notification.controller");
const notification_service_1 = require("./notification.service");
describe('NotificationController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [notification_controller_1.NotificationController],
            providers: [notification_service_1.NotificationService],
        }).compile();
        controller = module.get(notification_controller_1.NotificationController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=notification.controller.spec.js.map