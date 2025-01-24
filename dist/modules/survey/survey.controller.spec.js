"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const survey_controller_1 = require("./survey.controller");
const survey_service_1 = require("./survey.service");
describe('SurveyController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [survey_controller_1.SurveyController],
            providers: [survey_service_1.SurveyService],
        }).compile();
        controller = module.get(survey_controller_1.SurveyController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=survey.controller.spec.js.map