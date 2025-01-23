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
exports.ListController = void 0;
const common_1 = require("@nestjs/common");
const list_service_1 = require("./list.service");
const create_list_dto_1 = require("./dto/create-list.dto");
const update_list_dto_1 = require("./dto/update-list.dto");
let ListController = class ListController {
    constructor(listService) {
        this.listService = listService;
    }
    create(createListDto, req) {
        const userId = req.user.sub;
        return this.listService.createList(userId, createListDto);
    }
    findAll(params, req) {
        const userId = req.user.sub;
        return this.listService.getAllLists(userId, params);
    }
    findOne(id, req) {
        const userId = req.user.sub;
        return this.listService.getListById(userId, id);
    }
    update(id, updateListDto, req) {
        const userId = req.user.sub;
        return this.listService.updateListName(userId, id, updateListDto.name);
    }
    remove(id, req) {
        const userId = req.user.sub;
        return this.listService.deleteListWithRecipients(userId, id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_list_dto_1.CreateListDto, Object]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_list_dto_1.UpdateListDto, Object]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "remove", null);
ListController = __decorate([
    (0, common_1.Controller)("lists"),
    __metadata("design:paramtypes", [list_service_1.ListService])
], ListController);
exports.ListController = ListController;
//# sourceMappingURL=list.controller.js.map