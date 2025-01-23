import { PrismaService } from "../../shared/services/prisma.service";
import { User } from "@prisma/client";
import { ResponseData } from "../../shared/interfaces";
import { UpdateOrgDto } from "../users/dtos/user.dto";
import { MailGunService } from "../../shared/services/mailgun.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
interface UserQueryArg {
    search?: string;
    pageNumber?: number | 1;
    pageSize?: number | 10;
    sortBy?: string;
    sortDir?: string;
}
export declare class AdminsService {
    private prisma;
    private mailGunService;
    constructor(prisma: PrismaService, mailGunService: MailGunService);
    createUser(id: string, input: CreateUserDto): Promise<ResponseData>;
    createUser0(id: string, input: CreateUserDto): Promise<ResponseData>;
    findUsers(adminId: string, paramsObj: UserQueryArg): Promise<any>;
    findUsersOld(paramsObj: UserQueryArg): Promise<any>;
    findUser(id: string): Promise<User>;
    transferRole(id: string, data: UpdateUserDto): Promise<User>;
    updateUser(id: string, data: UpdateUserDto): Promise<User>;
    removeUsers(ids: string[]): Promise<void>;
    updateOrganizationDetails(id: string, data: UpdateOrgDto): Promise<User>;
    updateThemeColor(id: string, data: UpdateOrgDto): Promise<User>;
    updateCompanyLogo(id: string, logoUrl: string): Promise<ResponseData>;
}
export {};
