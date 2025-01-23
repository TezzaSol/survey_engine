export declare class CreateUserDto {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber: string;
    country: string;
    isVerified?: boolean;
    verificationCode?: number;
    subscriptionPlan?: string;
    trialStartDate?: string;
    isTrialActive?: boolean;
    department: string;
    orgName: string;
    orgEmail: string;
    orgAddress: string;
    orgWebsite: string;
    logoUrl: string;
    themeColor: string;
}
