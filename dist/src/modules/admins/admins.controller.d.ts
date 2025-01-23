/// <reference types="multer" />
import { AdminsService } from "./admins.service";
import { UpdateOrgDto } from "../users/dtos/user.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ResponseData } from "../../shared/interfaces";
import { UserEntity } from "../users/entities/user.entity";
import { CloudinaryService } from "../../shared/services/cloudinary.service";
export declare class AdminsController {
    private readonly adminsService;
    private cloudinaryService;
    constructor(adminsService: AdminsService, cloudinaryService: CloudinaryService);
    create(createUserDto: CreateUserDto, req: any): Promise<ResponseData>;
    findAllOld(params: any): Promise<UserEntity[]>;
    findAll(req: any, params: any): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    transferRole(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(userIds: string): Promise<void>;
    updateOrganizationDetails(id: string, updateOrgDto: UpdateOrgDto): Promise<UserEntity>;
    updateThemeColor(id: string, updateOrgDto: UpdateOrgDto): Promise<UserEntity>;
    uploadLogo(logo: Express.Multer.File, req: any): Promise<ResponseData>;
}
