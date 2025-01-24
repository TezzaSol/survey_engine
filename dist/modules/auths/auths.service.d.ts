import { PrismaService } from "../../shared/services/prisma.service";
export declare class AuthsService {
    private prisma;
    constructor(prisma: PrismaService);
    googleAcc(userId: string, tokens: any): Promise<{
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
}
