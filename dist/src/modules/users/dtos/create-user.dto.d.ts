import { Role } from "@prisma/client";
export declare class CreateUserDto {
    id: string;
    firstname: string;
    lastname: string;
    username?: string;
    email: string;
    phoneNumber?: string;
    department: string;
    role: Role;
    password: string;
}
export declare class UpdateUserDto {
    email: string;
    password: string;
}
export declare class UpdateOrgDto {
    orgName: string;
    orgEmail: string;
    orgAddress: string;
    orgWebsite: string;
    logoUrl?: string;
    themeColor?: string;
}
