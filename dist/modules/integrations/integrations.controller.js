"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const create_integration_dto_1 = require("./dto/create-integration.dto");
const prisma_service_1 = require("../../shared/services/prisma.service");
let IntegrationsController = class IntegrationsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createIntegration(createIntegrationDto) {
        const integration = await this.prisma.integration.create({
            data: createIntegrationDto,
        });
        return {
            message: "Integration successfully created",
            data: integration,
        };
    }
    async getAllIntegrations() {
        const integrations = await this.prisma.integration.findMany();
        return {
            message: "Integrations retrieved successfully",
            data: integrations,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_integration_dto_1.CreateIntegrationDto]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createIntegration", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getAllIntegrations", null);
IntegrationsController = __decorate([
    (0, common_1.Controller)("integrations"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IntegrationsController);
exports.IntegrationsController = IntegrationsController;
//# sourceMappingURL=integrations.controller.js.map