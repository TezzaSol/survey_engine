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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dtos/create-payment.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPaymentDto(req, createPaymentDto) {
        const userId = req.user.sub;
        return this.paymentService.createPaymentDto(userId, createPaymentDto);
    }
    async findAll() {
        return this.paymentService.findAll();
    }
    async findById(id) {
        return this.paymentService.findById(id);
    }
    async downloadTransactionDetailsAsPDF(id, res) {
        return this.paymentService.transactionDetailsAsPDF(id, res);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentDto", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findById", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id/download-pdf"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "downloadTransactionDetailsAsPDF", null);
PaymentController = __decorate([
    (0, common_1.Controller)("subscription"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map