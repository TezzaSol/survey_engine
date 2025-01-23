export declare class SendGridService {
    constructor();
    sendEmail(to: string, subject: string, content: string): Promise<void>;
}
