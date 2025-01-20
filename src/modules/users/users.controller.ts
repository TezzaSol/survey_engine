import {
  Controller,
  UseGuards,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  Patch,
  Req,
} from "@nestjs/common";
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/user.dto';
import { RolesGuard } from "../../common/guards/role.guard";
import { UserRole } from "../../shared/enums/user-role.enum";
import { Roles } from "../../common/decorators/role.decorator";
import { ResponseData } from "src/shared/interfaces";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { Public } from "../../common/decorators/public.decorator";
import { UpdateThemeColorDto } from "./dtos/update-theme-color";

@Controller("users")
@Roles(UserRole.User) // Only admins can access this endpoint
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Put("reset-password/:id")
  async resetPassword(
    @Param("id") id: string,
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<ResponseData> {
    return this.usersService.resetPassword(id, resetPasswordDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseData> {
    let user = await this.usersService.updateProfile(id, updateUserDto);
    return user;
  }

  @Put("change-password/:id")
  async changePassword(
    @Param("id") id: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<ResponseData> {
    return this.usersService.changePassword(
      id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
      changePasswordDto.confirmNewPassword
    );
  }

  @Put("login-activity/:id")
  async loginActivity(
    @Param("id") id: string,
    @Req() req
  ): Promise<ResponseData> {
    return this.usersService.loginActivity(id, req.body.loggedInActivity);
  }

  @Put("archive/:id")
  async archiveUser(@Param("id") id: string): Promise<ResponseData> {
    return await this.usersService.archiveUser(id);
  }

  @HttpCode(204)
  @Delete("delete/:id")
  async deleteUser(@Param("id") id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Patch("theme-color/:id")
  async updateThemeColor(
    @Param("id") userId: string,
    @Body() updateThemeColorDto: UpdateThemeColorDto
  ) {
    return this.usersService.updateThemeColor(userId, updateThemeColorDto);
  }
}







