import { PrismaService } from "../../shared/services/prisma.service";
import { UpdateUserDto } from "./dtos/user.dto";
import { ResponseData } from "../../shared/interfaces";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { MailGunService } from "../../shared/services/mailgun.service";
import { UpdateThemeColorDto } from "./dtos/update-theme-color";
export declare class UsersService {
    private prisma;
    private mailGunService;
    constructor(prisma: PrismaService, mailGunService: MailGunService);
    resetPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    updateProfile(id: string, data: UpdateUserDto): Promise<ResponseData>;
    changePassword(userId: string, oldPassword: string, newPassword: string, confirmNewPassword: string): Promise<ResponseData>;
    loginActivity(id: string, loggedInActivity: boolean): Promise<ResponseData>;
    archiveUser(userId: string): Promise<ResponseData>;
    deleteUser(userId: string): Promise<void>;
    updateThemeColor(userId: string, updateThemeColorDto: UpdateThemeColorDto): Promise<ResponseData>;
}
