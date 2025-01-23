import { PrismaService } from "./prisma.service";
export declare class GoogleService {
    private prisma;
    private oauth2Client;
    private callbackPath;
    private googleRedirectUrl;
    constructor(prisma: PrismaService);
    getConsentUrl(state: string): string;
    getTokens(code: string): Promise<any>;
    verifyBusinessProfileAccount(code: string): Promise<any>;
}
