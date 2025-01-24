import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/user.dto';
import { ResponseData } from "../../shared/interfaces";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { UpdateThemeColorDto } from "./dtos/update-theme-color";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    resetPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<ResponseData>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseData>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ResponseData>;
    loginActivity(id: string, req: any): Promise<ResponseData>;
    archiveUser(id: string): Promise<ResponseData>;
    deleteUser(id: string): Promise<void>;
    updateThemeColor(userId: string, updateThemeColorDto: UpdateThemeColorDto): Promise<ResponseData>;
}
