import { Role, Status } from "@prisma/client";
export declare class CreateUserDto {
    id: string;
    firstname: string;
    lastname: string;
    template?: string;
    context?: string[];
    email: string;
    phoneNumber?: string;
    department?: string;
    role: Role;
    password: string;
    status?: Status;
    orgName?: string;
    orgEmail?: string;
    orgAddress?: string;
    orgWebsite?: string;
    logoUrl?: string;
    themeColor?: string;
    adminId?: string;
}
export declare class UpdateUserDto {
    email: string;
    password: string;
    status?: Status;
}
export declare class UpdateOrgDto {
    orgName?: string;
    orgEmail?: string;
    orgAddress?: string;
    orgWebsite?: string;
    logoUrl?: string;
    themeColor?: string;
    status?: Status;
}
