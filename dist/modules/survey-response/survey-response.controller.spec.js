"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const survey_response_controller_1 = require("./survey-response.controller");
const survey_response_service_1 = require("./survey-response.service");
describe('SurveyResponseController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [survey_response_controller_1.SurveyResponseController],
            providers: [survey_response_service_1.SurveyResponseService],
        }).compile();
        controller = module.get(survey_response_controller_1.SurveyResponseController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=survey-response.controller.spec.js.map