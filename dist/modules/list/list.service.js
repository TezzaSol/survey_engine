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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let ListService = class ListService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createList(userId, data) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        const adminId = user?.adminId || user.id;
        const list = await this.prisma.list.findFirst({
            where: { name: data?.name, adminId: adminId },
        });
        if (list)
            throw new common_1.ConflictException(`List with this name ${data.name} already exits`);
        const createWithAdminId = { ...data, adminId };
        return this.prisma.list.create({ data: createWithAdminId });
    }
    async getAllLists(userId, params) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        const adminId = user?.adminId || user.id;
        const recipientCount = await this.prisma.list.aggregate({
            _count: true,
            where: {
                adminId: adminId,
            },
        });
        const filterParams = params.q
            ? {
                OR: [{ name: { contains: params.q, mode: "insensitive" } }],
                adminId: adminId,
            }
            : { adminId: adminId };
        const sortBy = params.sortBy || "id";
        const sortDir = params.sortDir || "desc";
        const pageSize = Number(params.pageSize) || 10;
        const pageNumber = Number(params.pageNumber) || 1;
        const skip = (pageNumber - 1) * pageSize;
        const lists = await this.prisma.list.findMany({
            take: (pageSize + 1) | 11,
            skip,
            where: { ...filterParams },
            include: { recipients: true },
            orderBy: sortBy ? { [sortBy]: sortDir } : undefined,
        });
        const hasNextPage = lists.length > pageSize;
        const edges = hasNextPage ? lists.slice(0, pageSize) : lists;
        return {
            meta: {
                q: params.q,
                startDate: params.startDate,
                endDate: params.endDate,
                sortBy,
                sortDir,
                pageSize,
                pageNumber,
                hasNextPage,
                endCursor: hasNextPage ? edges[pageSize - 1].id : null,
                totalPages: Math.ceil(lists.length / pageSize),
                totalItems: recipientCount?._count,
            },
            data: edges,
        };
    }
    async getListById(userId, id) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        const adminId = user?.adminId || user.id;
        return this.prisma.list.findUnique({
            where: { id, adminId },
            include: { recipients: true },
        });
    }
    async updateListName(userId, id, name) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        const adminId = user?.adminId || user.id;
        return this.prisma.list.update({
            where: { id, adminId },
            data: { name },
        });
    }
    async deleteList(id) {
        return this.prisma.list.delete({
            where: { id },
        });
    }
    async deleteListWithRecipients(userId, id) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        const adminId = user?.adminId || user.id;
        await this.prisma.recipient.deleteMany({
            where: { listId: id },
        });
        return this.prisma.list.delete({
            where: { id, adminId },
        });
    }
    async updateRecipient(id, data) {
        return this.prisma.recipient.update({
            where: { id },
            data,
        });
    }
};
ListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListService);
exports.ListService = ListService;
//# sourceMappingURL=list.service.js.map