import { ListService } from "./list.service";
import { List } from "@prisma/client";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { PagedResponse, PageParams } from "src/shared/interfaces";
export declare class ListController {
    private readonly listService;
    constructor(listService: ListService);
    create(createListDto: CreateListDto, req: any): Promise<List>;
    findAll(params: PageParams, req: any): Promise<PagedResponse>;
    findOne(id: string, req: any): Promise<List>;
    update(id: string, updateListDto: UpdateListDto, req: any): Promise<List>;
    remove(id: string, req: any): Promise<List>;
}
