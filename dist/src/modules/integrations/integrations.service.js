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
exports.IntegrationController = exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
let IntegrationsService = class IntegrationsService {
};
IntegrationsService = __decorate([
    (0, common_1.Injectable)()
], IntegrationsService);
exports.IntegrationsService = IntegrationsService;
const common_2 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const create_integration_dto_1 = require("./dto/create-integration.dto");
let IntegrationController = class IntegrationController {
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
    (0, common_2.Post)(),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_integration_dto_1.CreateIntegrationDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "createIntegration", null);
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getAllIntegrations", null);
IntegrationController = __decorate([
    (0, common_2.Controller)("integrations"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IntegrationController);
exports.IntegrationController = IntegrationController;
//# sourceMappingURL=integrations.service.js.map