"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRecipientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_recipient_dto_1 = require("./create-recipient.dto");
class UpdateRecipientDto extends (0, swagger_1.PartialType)(create_recipient_dto_1.CreateRecipientDto) {
}
exports.UpdateRecipientDto = UpdateRecipientDto;
//# sourceMappingURL=update-recipient.dto.js.map