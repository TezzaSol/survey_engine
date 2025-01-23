"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = void 0;
const header_1 = require("../header_footer/header");
const footer_1 = require("../header_footer/footer");
const welcome = async (firstname, email, password) => `
${await (0, header_1.header)()}
 
 <body style="width: 100% !important; height: 100%; -webkit-text-size-adjust: none; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; background-color: #FFF; color: #333; margin: 0;" bgcolor="#FFF">
    <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Dear ${firstname}</span>
  <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Your account was succesfully created.</span>
    <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">To help you get started, we want to provide you with your login details.</span>
    <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Email: ${email}</span>
    <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Password: ${password}</span>
    <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">For security reasons, we have generated a temporary password for you. To ensure the safety of your account
    we kindly ask you to set your yur password by clicking the button below.</span>

        <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Use this link to reset your password. The link is only valid for 24 hours.</span>
    <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Use this link to reset your password. The link is only valid for 24 hours.</span>


    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; margin: 0; padding: 0;">
      <tr>
        <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; margin: 0; padding: 0;">
            <tr>
              <td class="email-masthead" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; text-align: center; padding: 25px 0;" align="center">
                <a href= <%= ENV["APP_WEB"] %> class="f-fallback email-masthead_name" style="color: #A8AAAF; font-size: 16px; font-weight: bold; text-decoration: none; text-shadow: 0 1px 0 white;">
                  <img style="max-width: 300px; max-height: 150px"   src=<%= ENV["CLIENT_APP"] + "/_next/image?url=%2Fassets%2Fmainlogo.png&w=1920&q=75" %> />
                </a>
                <div>
                   <h1 style="text-align: center; color: #0F5A9B; font-weight: lighter"><%= @subject %></h1>
                </div>
              </td>
            </tr>

 
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; margin: 0; padding: 0;">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; margin: 0 auto; padding: 0;">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
                      <div class="f-fallback">
                        <h1 style="margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left;" align="left">Hi <%= @resource.first_name %>,</h1>
                        <p style="font-size: 16px; line-height: 1.625; color: #333; margin: .4em 0 1.1875em;">You have requested a password reset on your account. Kindly set your password by clicking the button below </p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; margin: 30px auto; padding: 0;">
                          <tr>
                            <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                              <!-- Border based button
           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                  <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                                    <a href= <%= "#{ENV["CLIENT_APP"]}/reset-password?reset_password_token=#{@token}" %> class="f-fallback button button--blue" target="_blank" style="color: #FFF; background-color: #0F5A9B; display: inline-block; text-decoration: none; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); -webkit-text-size-adjust: none; box-sizing: border-box; border-color: #0F5A9B; border-style: solid; border-width: 10px 18px;">Change password</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="font-size: 16px; line-height: 1.625; color: #333; margin: .4em 0 1.1875em;">If the button above doesn’t work, click or copy/paste the link below into your browser </p>
                        <p style="font-size: 16px; line-height: 1.625; color: #333; margin: .4em 0 1.1875em;"> <%= link_to "#{ENV["CLIENT_APP"]}/reset-password?reset_password_token=#{@token}",  "#{ENV["CLIENT_APP"]}/reset-password?reset_password_token=#{@token}" %> </p>

 
                        <p style="font-size: 16px; line-height: 1.625; color: #333; margin: .4em 0 1.1875em;">Setting your unique password is a crucial step in securing your account and ensuring your privacy.</p>
                        <p style="font-size: 16px; line-height: 1.625; color: #333; margin: .4em 0 1.1875em;">If you have any questions, encounter any issues, or need assistance with anything, please don't hesitate to contact our friendly support team at <strong>support@connect.com. </strong>We're here to help you every step of the way.</p>
                        <p style="font-size: 16px; line-height: 1.625; color: #333; margin: .4em 0 1.1875em;">Warm regards,</p>

 
                        <!-- Sub copy -->
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

${await (0, footer_1.footer)()}
`;
exports.welcome = welcome;
//# sourceMappingURL=welcome.js.map