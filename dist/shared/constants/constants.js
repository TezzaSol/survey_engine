"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configContants = void 0;
exports.configContants = {
    port: 'PORT',
    jwtSecret: 'JWT_SECRET',
    jwtDuration: 'JWT_DURATION',
    refreshTokenSecret: 'REFRESH_TOKEN_SECRET',
    refreshTokenDuration: 'REFRESH_TOKEN_DURATION',
    tokenDuration: 'TOKEN_EXPIRATION_DURATION',
    frontendForgotPasswordUrl: 'FRONTEND_FORGOT_PASSWORD_URL',
    sendGrid: {
        sendGridEmailApiKey: 'SENDGRID_EMAIL_API_KEY',
        sendGridFromAddress: 'SENDGRID_FROM_ADDRESS',
        template: {
            welcomeTemplateId: 'WELCOME_EMAIL_TEMPLATE_ID',
            verificationTemplateId: 'VERIFICIATION_EMAIL_TEMPLATE_ID',
            passwordRecoveryTemplateId: 'PASSWORD_RECOVERY_TEMPLATE_ID',
            passwordResetConfirmed: 'PASSWORD_RESET_CONFIRMED',
            accountVerified: 'ACCOUNT_VERIFIED',
            confirmationCode: 'CONFIRMATION_CODE',
        },
    },
};
//# sourceMappingURL=constants.js.map