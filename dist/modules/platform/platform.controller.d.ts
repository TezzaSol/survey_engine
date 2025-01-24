import { PlatformService } from "./platform.service";
import { CreatePlatformDto } from "./dto/create-platform.dto";
import { UpdatePlatformDto } from "./dto/update-platform.dto";
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    create(createPlatformDto: CreatePlatformDto, req: any): Promise<{
        id: string;
        name: string;
        url: string;
        isActive: boolean;
        accessToken: string;
        refreshToken: string;
        tokenExpireAt: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | {
        message: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        name: string;
        url: string;
        isActive: boolean;
        accessToken: string;
        refreshToken: string;
        tokenExpireAt: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        name: string;
        url: string;
        isActive: boolean;
        accessToken: string;
        refreshToken: string;
        tokenExpireAt: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    update(id: string, updatePlatformDto: UpdatePlatformDto, req: any): Promise<{
        id: string;
        name: string;
        url: string;
        isActive: boolean;
        accessToken: string;
        refreshToken: string;
        tokenExpireAt: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        name: string;
        url: string;
        isActive: boolean;
        accessToken: string;
        refreshToken: string;
        tokenExpireAt: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    toggleStatus(id: string, req: any): Promise<{
        id: string;
        name: string;
        url: string;
        isActive: boolean;
        accessToken: string;
        refreshToken: string;
        tokenExpireAt: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
