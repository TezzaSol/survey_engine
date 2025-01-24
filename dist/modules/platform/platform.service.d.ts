import { PrismaService } from "../../shared/services/prisma.service";
import { CreatePlatformDto } from "./dto/create-platform.dto";
import { UpdatePlatformDto } from "./dto/update-platform.dto";
export declare class PlatformService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createPlatformDto: CreatePlatformDto): Promise<{
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
    findAll(userId: string): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    update(userId: string, id: string, updatePlatformDto: UpdatePlatformDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
    togglePlatformStatus(userId: string, id: string): Promise<{
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
