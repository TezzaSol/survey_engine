import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
} from "@nestjs/common";
import { PlatformService } from "./platform.service";
import { CreatePlatformDto } from "./dto/create-platform.dto";
import { UpdatePlatformDto } from "./dto/update-platform.dto";

@Controller("platforms")
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  create(@Body() createPlatformDto: CreatePlatformDto, @Request() req) {
    const userId = req.user.sub;
    return this.platformService.create(userId, createPlatformDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.sub;
    return this.platformService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req) {
    const userId = req.user.sub;
    return this.platformService.findOne(id, userId);
  }

  @Patch(":id")
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.platformService.update(userId, id, updatePlatformDto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string, @Request() req) {
    const userId = req.user.sub;

    return this.platformService.remove(userId, id);
  }

  @Patch(":id/toggle-active")
  @Put(":id/toggle-active")
  toggleStatus(@Param("id") id: string, @Request() req) {
    const userId = req.user.sub;
    return this.platformService.togglePlatformStatus(userId, id);
  }
}
