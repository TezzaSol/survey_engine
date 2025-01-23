"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSurveyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ordinal_scale_survey_dto_1 = require("./create-ordinal-scale-survey.dto");
class UpdateSurveyDto extends (0, swagger_1.PartialType)(create_ordinal_scale_survey_dto_1.CreateOrdinalScaleSurveyDto) {
}
exports.UpdateSurveyDto = UpdateSurveyDto;
//# sourceMappingURL=update-survey.dto.js.map