import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { List, Prisma, Recipient } from "@prisma/client";
import { CreateListDto } from "./dto/create-list.dto";
import { PagedResponse, PageParams } from "../../shared/interfaces";

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async createList(userId: string, data: CreateListDto): Promise<List> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    const adminId = user?.adminId || user.id;

    const list = await this.prisma.list.findFirst({
      where: { name: data?.name, adminId: adminId },
    });
    if (list)
      throw new ConflictException(
        `List with this name ${data.name} already exits`,
      );
    const createWithAdminId = { ...data, adminId };
    return this.prisma.list.create({ data: createWithAdminId });
  }

  async getAllLists(
    userId: string,
    params: PageParams,
  ): Promise<PagedResponse> {
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

    const filterParams: object = params.q
      ? {
          OR: [{ name: { contains: params.q, mode: "insensitive" } }],
          adminId: adminId,
        }
      : { adminId: adminId };

    // set defaults
    const sortBy = params.sortBy || "id";
    const sortDir = params.sortDir || "desc";
    const pageSize = Number(params.pageSize) || 10;
    const pageNumber = Number(params.pageNumber) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const lists = await this.prisma.list.findMany({
      take: (pageSize + 1) | 11,
      skip,
      where: { ...filterParams }, //...dateParams }
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

  async getListById(userId: string, id: string): Promise<List> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    const adminId = user?.adminId || user.id;

    return this.prisma.list.findUnique({
      where: { id, adminId },
      include: { recipients: true },
    });
  }

  async updateListName(
    userId: string,
    id: string,
    name: string,
  ): Promise<List> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    const adminId = user?.adminId || user.id;
    return this.prisma.list.update({
      where: { id, adminId },
      data: { name },
    });
  }

  async deleteList(id: string): Promise<List> {
    return this.prisma.list.delete({
      where: { id },
    });
  }

  async deleteListWithRecipients(userId: string, id: string): Promise<List> {
    // Delete the recipients first
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    const adminId = user?.adminId || user.id;

    await this.prisma.recipient.deleteMany({
      where: { listId: id },
    });

    // Then delete the list
    return this.prisma.list.delete({
      where: { id, adminId },
    });
  }

  async updateRecipient(
    id: string,
    data: Prisma.RecipientUpdateInput
  ): Promise<Recipient> {
    return this.prisma.recipient.update({
      where: { id },
      data,
    });
  }
}
