"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const survey_response_service_1 = require("./survey-response.service");
describe('SurveyResponseService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [survey_response_service_1.SurveyResponseService],
        }).compile();
        service = module.get(survey_response_service_1.SurveyResponseService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=survey-response.service.spec.js.map