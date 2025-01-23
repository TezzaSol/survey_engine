import {
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  Request,
  
} from "@nestjs/common";
import { AdminsService } from "./admins.service";
import {
  // CreateUserDto,
  UpdateOrgDto,
  // UpdateUserDto,
} from "../users/dtos/user.dto";

import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

import { RolesGuard } from "../../common/guards/role.guard";
import { UserRole } from "../../shared/enums/user-role.enum";
import { Roles } from "../../common/decorators/role.decorator";
import { ResponseData } from "../../shared/interfaces";
import { UserEntity } from "../users/entities/user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { CloudinaryService } from "../../shared/services/cloudinary.service";
import { Response } from "express";


@UseGuards(RolesGuard)
@Roles(UserRole.Admin) // Only admins can access this endpoint
@Controller("admin")
@UseInterceptors(ClassSerializerInterceptor)
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private cloudinaryService: CloudinaryService
  ) {}

  @Post("users")
  create(
    @Body() createUserDto: CreateUserDto,
    @Request() req
  ): Promise<ResponseData> {
    const id = req.user.sub;
    return this.adminsService.createUser(id, createUserDto);
  }

  @Get("usersOld")
  findAllOld(@Query() params: any): Promise<UserEntity[]> {
    return this.adminsService.findUsersOld({
      search: params.q,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    });
  }

  @Get("users")
  findAll(@Request() req, @Query() params: any): Promise<UserEntity[]> {
    const adminId = req.user.sub;
    const UserQueryArg = {
      search: params.q,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
      adminId: params.adminId,
    };
    return this.adminsService.findUsers(adminId, UserQueryArg);
  }

  @Get("users/:id")
  async findOne(@Param("id") id: string): Promise<UserEntity> {
    let user = await this.adminsService.findUser(id);
    return new UserEntity(user);
  }

  // @Put("users/:id")
  // @Patch("users/:id")
  // async update(
  //   @Param("id") id: string,
  //   @Body() updateUserDto: UpdateUserDto
  // ): Promise<UserEntity> {
  //   let user = await this.adminsService.updateUser(id, updateUserDto);
  //   return new UserEntity(user);
  // }

  @Put("users/:id")
  @Patch("users/:id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    let user = await this.adminsService.updateUser(id, updateUserDto);
    return new UserEntity(user);
  }

  @Put("transfer-role/:id")
  async transferRole(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    let user = await this.adminsService.transferRole(id, updateUserDto);
    return new UserEntity(user);
  }

  @HttpCode(204)
  @Delete("users")
  remove(@Query("ids") userIds: string): Promise<void> {
    const userIdArray = userIds.split(",");
    return this.adminsService.removeUsers(userIdArray);
  }

  @Put("update-organization-details/:id")
  async updateOrganizationDetails(
    @Param("id") id: string,
    @Body() updateOrgDto: UpdateOrgDto
  ): Promise<UserEntity> {
    let user = await this.adminsService.updateOrganizationDetails(
      id,
      updateOrgDto
    );
    return new UserEntity(user);
  }

  @Put("update-theme-color/:id")
  async updateThemeColor(
    @Param("id") id: string,
    @Body() updateOrgDto: UpdateOrgDto
  ): Promise<UserEntity> {
    let user = await this.adminsService.updateThemeColor(id, updateOrgDto);
    return new UserEntity(user);
  }

  @Patch("upload-logo")
  @UseInterceptors(FileInterceptor("logo"))
  async uploadLogo(
    @UploadedFile() logo: Express.Multer.File,
    @Request() req
  ): Promise<ResponseData> {
    const id = req.user.sub;
    const logoUrl = await this.cloudinaryService.uploadLogo(logo);
    return this.adminsService.updateCompanyLogo(id, logoUrl.secure_url);
  }
}


