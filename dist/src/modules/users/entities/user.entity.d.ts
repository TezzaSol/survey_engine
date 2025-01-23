export declare class UserEntity {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    department: string;
    role: string;
    createdAt: Date;
    loggedInActivity?: boolean;
    status?: string;
    password?: string;
    updatedAt?: Date;
    constructor(partial: Partial<UserEntity>);
}
