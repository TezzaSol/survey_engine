"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlatformDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_platform_dto_1 = require("./create-platform.dto");
class UpdatePlatformDto extends (0, swagger_1.PartialType)(create_platform_dto_1.CreatePlatformDto) {
}
exports.UpdatePlatformDto = UpdatePlatformDto;
//# sourceMappingURL=update-platform.dto.js.map