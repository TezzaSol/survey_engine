import { ResponseData } from "../interfaces";
import { PrismaService } from "../../shared/services/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { MailGunService } from "../services/mailgun.service";
export declare class Utils {
    private prisma;
    jwtService: JwtService;
    private mailGunService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailGunService: MailGunService);
    static response(data: Partial<ResponseData>): ResponseData;
    static unixTimestamp(): number;
    private sendResetPasswordEmail;
    static checkEntityExists<T>(entity: T | null, id: string, entityName: string): T;
}
