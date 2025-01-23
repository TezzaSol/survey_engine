import { PrismaService } from "../../shared/services/prisma.service";
import { List, Prisma, Recipient } from "@prisma/client";
import { CreateListDto } from "./dto/create-list.dto";
import { PagedResponse, PageParams } from "src/shared/interfaces";
export declare class ListService {
    private prisma;
    constructor(prisma: PrismaService);
    createList(userId: string, data: CreateListDto): Promise<List>;
    getAllLists(userId: string, params: PageParams): Promise<PagedResponse>;
    getListById(userId: string, id: string): Promise<List>;
    updateListName(userId: string, id: string, name: string): Promise<List>;
    deleteList(id: string): Promise<List>;
    deleteListWithRecipients(userId: string, id: string): Promise<List>;
    updateRecipient(id: string, data: Prisma.RecipientUpdateInput): Promise<Recipient>;
}
