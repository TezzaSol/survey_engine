import { GoogleService } from "src/shared/services/google.service";
import { AuthsService } from "./auths.service";
import { Response } from "express";
export declare class AuthsController {
    private readonly authsService;
    private googleService;
    constructor(authsService: AuthsService, googleService: GoogleService);
    googleLogin(req: any): Promise<{
        url: string;
    }>;
    callback(code: string, res: Response, state: string): Promise<Response<any, Record<string, any>> | {
        message: string;
    }>;
}
