import { Role } from "@prisma/client";
export declare class CreateUserDto {
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
}
