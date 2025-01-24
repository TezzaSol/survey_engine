import { CreateIntegrationDto } from "./dto/create-integration.dto";
import { PrismaService } from "../../shared/services/prisma.service";
export declare class IntegrationsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            description: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getAllIntegrations(): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            description: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}
