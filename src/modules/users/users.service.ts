// users.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { UpdateUserDto } from "./dtos/user.dto";
import { ResponseData } from "../../shared/interfaces";
import { Utils } from "../../shared/utils";
import { compare, hash } from "bcryptjs";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { MailGunService } from "../../shared/services/mailgun.service";
import { UpdateThemeColorDto } from "./dtos/update-theme-color";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailGunService: MailGunService
  ) {}

  async resetPassword(id: string, resetPasswordDto: ResetPasswordDto) {
    const { firstname, lastname, password, confirmPassword } = resetPasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Step 2: Check if password matches confirmNewPassword
    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    // Step 3: Hash the new password
    const hashedPassword = await hash(password, 10);

    // Step 4: Update the user's password in the database
    await this.prisma.user.update({
      where: { id },
      data: {
        firstname,
        lastname,
        password: hashedPassword,
        status: "ACTIVE"
      },
    });

    return { message: "Account Setup Successfully" };
  }

  async updateProfile(id: string, data: UpdateUserDto): Promise<ResponseData> {
    try {
      const response = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          phoneNumber: true,
          department: true,
          role: true,
        },
      });
      return Utils.response({
        data: response,
        message: "User Profile sucessfully updated",
      });
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  /**
   * Changes the user's password after validating the old password and confirming the new password.
   *
   * @param userId - The ID of the user whose password is to be changed.
   * @param oldPassword - The user's current password.
   * @param newPassword - The new password the user wants to set.
   * @param confirmNewPassword - Confirmation of the new password.
   * @returns A promise that resolves to a ResponseData object indicating success.
   * @throws NotFoundException if the user does not exist.
   * @throws BadRequestException if the old password is incorrect or the new passwords do not match.
   */

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<ResponseData> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // I check if password is correct by comparing it with the hashed password in the database
    if (!(await compare(oldPassword, user.password))) {
      throw new BadRequestException("Invalid old password.");
    }

    // Validate that the new passwords match
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException("New passwords do not match.");
    }

    const hashedNewPassword = await hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return Utils.response({
      message: "Password sucessfully changed",
    });
  }

  async loginActivity(
    id: string,
    loggedInActivity: boolean
  ): Promise<ResponseData> {
    // console.log("loggedInActivity", loggedInActivity);
    await this.prisma.user.update({
      where: { id },
      data: { loggedInActivity },
    });

    return Utils.response({
      message: loggedInActivity
        ? "Login activity activated"
        : "Login activity deactivated",
    });
  }

  async archiveUser(userId: string): Promise<ResponseData> {
    try {
      // Set the status to INACTIVE and archive the account
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          status: "INACTIVE",
          isAccountArchived: true,
        },
      });

      const appName = process.env.APP_NAME;
      const subject = "Account Archived";
      const html = `Your Account has been sucessfully archived. Kindly contact the customer care to reactivate your account if you want to resume using the platform.`;
      const context = { user: user?.firstname || "there", appName };
      const templateName = "archive-account";
      await this.mailGunService.sendEmailWithTemplate({
        to: user.email,
        subject,
        templateName,
        context,
      });

      return { message: "User Account Succesfully Archived" };
    } catch (error) {
      // console.log(error)
      throw new HttpException("Failed to archive user", HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Start a transaction to ensure everything is deleted properly
      await this.prisma.$transaction(async (prisma) => {
        // Delete related survey response options
        await prisma.surveyResponseOption.deleteMany({
          where: {
            surveyResponse: {
              question: {
                survey: {
                  createdById: userId,
                },
              },
            },
          },
        });

        // Delete related survey responses
        await prisma.surveyResponse.deleteMany({
          where: {
            question: {
              survey: {
                createdById: userId,
              },
            },
          },
        });

        // Delete related options
        await prisma.option.deleteMany({
          where: {
            question: {
              survey: {
                createdById: userId,
              },
            },
          },
        });

        // Delete related questions
        await prisma.question.deleteMany({
          where: {
            survey: {
              createdById: userId,
            },
          },
        });

        // Delete surveys created by the user
        await prisma.survey.deleteMany({
          where: { createdById: userId },
        });

        // Delete related login activities
        await prisma.loginActivity.deleteMany({
          where: { userId },
        });

        // Finally, delete the user
        await prisma.user.delete({
          where: { id: userId },
        });
      });
    } catch (error) {
      throw new HttpException("Failed to delete user", HttpStatus.BAD_REQUEST);
    }
  }

  async updateThemeColor(
    userId: string,
    updateThemeColorDto: UpdateThemeColorDto
  ): Promise<ResponseData> {
    const { primaryColor, secondaryColor } = updateThemeColorDto;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        themeColor: {
          primaryColor: primaryColor ?? undefined, // Use undefined if primaryColor is not provided
          secondaryColor: secondaryColor ?? undefined,
        },
      },
    });

    return {message: "Theme color updated sucessfully"};
  }
}
