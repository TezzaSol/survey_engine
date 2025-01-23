export declare const configContants: {
    port: string;
    jwtSecret: string;
    jwtDuration: string;
    refreshTokenSecret: string;
    refreshTokenDuration: string;
    tokenDuration: string;
    frontendForgotPasswordUrl: string;
    sendGrid: {
        sendGridEmailApiKey: string;
        sendGridFromAddress: string;
        template: {
            welcomeTemplateId: string;
            verificationTemplateId: string;
            passwordRecoveryTemplateId: string;
            passwordResetConfirmed: string;
            accountVerified: string;
            confirmationCode: string;
        };
    };
};
