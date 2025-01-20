import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
  Patch,
  HttpCode,
  Request,
} from "@nestjs/common";
import { ListService } from "./list.service";
import { List } from "@prisma/client";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { PagedResponse, PageParams } from "src/shared/interfaces";

@Controller("lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  create(@Body() createListDto: CreateListDto, @Request() req): Promise<List> {
    const userId = req.user.sub;
    return this.listService.createList(userId, createListDto);
  }

  @Get()
  findAll(@Query() params: PageParams, @Request() req): Promise<PagedResponse> {
    const userId = req.user.sub;
    return this.listService.getAllLists(userId, params);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req): Promise<List> {
    const userId = req.user.sub;
    return this.listService.getListById(userId, id);
  }

  @Patch(":id")
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateListDto: UpdateListDto,
    @Request() req,
  ): Promise<List> {
        const userId = req.user.sub;

    return this.listService.updateListName(userId, id, updateListDto.name);
  }

  @HttpCode(204)
  @Delete(":id")
  remove(@Param("id") id: string, @Request() req): Promise<List> {
        const userId = req.user.sub;

    return this.listService.deleteListWithRecipients(userId, id);
  }
}
