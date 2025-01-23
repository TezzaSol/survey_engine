"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const survey_service_1 = require("./survey.service");
describe('SurveyService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [survey_service_1.SurveyService],
        }).compile();
        service = module.get(survey_service_1.SurveyService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=survey.service.spec.js.map