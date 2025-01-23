"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSurveyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_interval_scale_survey_dto_1 = require("./create-interval-scale-survey.dto");
class UpdateSurveyDto extends (0, swagger_1.PartialType)(create_interval_scale_survey_dto_1.CreateIntervalScaleSurveyDto) {
}
exports.UpdateSurveyDto = UpdateSurveyDto;
//# sourceMappingURL=update-survey.dto.js.map