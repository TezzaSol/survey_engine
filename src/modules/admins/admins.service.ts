import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { Role, Status, User } from "@prisma/client";
import { ResponseData } from "../../shared/interfaces";
import { Utils } from "../../shared/utils";
import {
  // CreateUserDto,
  UpdateOrgDto,
  // UpdateUserDto,
} from "../users/dtos/user.dto";
import { hash } from "bcryptjs";
import { MailGunService } from "../../shared/services/mailgun.service";
import * as jwt from "jsonwebtoken";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

// import { welcome } from "src/templates/signup/welcome";

interface UserQueryArg {
  search?: string;
  pageNumber?: number | 1;
  pageSize?: number | 10;
  sortBy?: string;
  sortDir?: string;
}

@Injectable()
export class AdminsService {
  constructor(
    private prisma: PrismaService,
    private mailGunService: MailGunService
  ) {}

  async createUser(id: string, input: CreateUserDto): Promise<ResponseData> {
    try {
      const { email, role } = input;

      // Fetch the admin who is creating the user
      const admin = await this.prisma.user.findUnique({
        where: { id },
        select: {
          subscriptionPlan: true,
          trialStartDate: true, // Retrieve the admin's trialStartDate
        },
      });

      if (!admin) {
        throw new NotFoundException("Admin not found");
      }

      // Check if the admin is on the BASIC subscription plan
      if (admin.subscriptionPlan === "BASIC") {
        const userCount = await this.prisma.user.count({
          where: { adminId: id }, // Count users created by the admin
        });

        // If the count exceeds 2, prevent further user creation
        if (userCount >= 2) {
          throw new ForbiddenException(
            "You have reached the user limit for the BASIC plan. Please upgrade to add more users."
          );
        }
      }

      // Additional check to enforce only TEAMMATE or OBSERVER roles
      if (role !== Role.TEAMMATE && role !== Role.OBSERVER) {
        throw new BadRequestException(
          "Invalid role. Only TEAMMATE or OBSERVER are allowed."
        );
      }

      // Check if a user with the same email already exists
      const user = await this.prisma.user.findFirst({
        where: { email: input?.email },
      });
      if (user) throw new ConflictException("User already exists");

      const auto_password = `${Utils.unixTimestamp()}`;
      const hashed_password = await hash(auto_password, 10);

      // Set expiration time for the verification code to 15 minutes from now
      const verificationCode = Math.floor(1000 + Math.random() * 9000); // generate a 4 digit unique verification code
      const verificationLink = `${process.env.WEBSITE_URL}/verify-email?email=${email}&code=${verificationCode}`;

      // Create the new user with the admin's trialStartDate
      const response = await this.prisma.user.create({
        data: {
          email,
          role,
          password: hashed_password,
          adminId: id,
          verificationCode,
          isVerified: true,
          verificationCodeExpiry: null,
          trialStartDate: admin.trialStartDate, // Use the admin's trialStartDate
        },
      });

      // Send reset password email
      const appName = process.env.APP_NAME;
      const subject = `Welcome to ${appName}! Please Verify Your Email`;
      const resetPasswordLink = `${process.env.WEBSITE_URL}/setup-account?userId=${response?.id}`;

      const context = {
        // resetPasswordLink,
        verificationLink,
        verificationCode,
        appName: appName,
      };
      await this.mailGunService.sendEmailWithTemplate({
        to: input?.email,
        subject,
        templateName: "sign-up",
        context,
      });

      return Utils.response({
        data: {
          email: response?.email,
          role: response?.role,
          status: response?.status,
          adminId: response?.adminId,
          trialStartDate: response?.trialStartDate,
        },
        message: "User successfully created",
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException("User already registered");
      }
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createUser0(id: string, input: CreateUserDto): Promise<ResponseData> {
    try {
      const { email, role } = input;

      // Fetch the admin who is creating the user
      const admin = await this.prisma.user.findUnique({
        where: { id },
        // include: {
        //   _count: {
        //     select: { organization: true }, // Assuming the organization contains users
        //   },
        // },
      });

      if (!admin) {
        throw new NotFoundException("Admin not found");
      }

      // Check if the admin is on the BASIC subscription plan
      if (admin.subscriptionPlan === "BASIC") {
        const userCount = await this.prisma.user.count({
          where: { adminId: id }, // Count users created by the admin
        });

        // If the count exceeds 2, prevent further user creation
        if (userCount >= 2) {
          throw new ForbiddenException(
            "You have reached the user limit for the BASIC plan. Please upgrade to add more users."
          );
        }
      }

      // Additional check to enforce only TEAMMATE or OBSERVER
      if (role !== Role.TEAMMATE && role !== Role.OBSERVER) {
        throw new BadRequestException(
          "Invalid role. Only TEAMMATE or OBSERVER are allowed."
        );
      }
      const user = await this.prisma.user.findFirst({
        where: { email: input?.email },
      });
      if (user) throw new ConflictException("User already exists");

      const auto_password = `${Utils.unixTimestamp()}`;
      const hashed_password = await hash(auto_password, 10);

      const response = await this.prisma.user.create({
        data: {
          email,
          role,
          password: hashed_password,
          adminId: id,
          isVerified: true,
          verificationCodeExpiry: null,
        },
      });

      // Send reset password email
      const appName = process.env.APP_NAME;
      const subject = `Welcome to ${appName}! Please Verify Your Email`;
      const resetPasswordLink = `${process.env.WEBSITE_URL}/setup-account?userId=${response?.id}`;

      const context = {
        resetPasswordLink,
        appName: appName,
      };
      await this.mailGunService.sendEmailWithTemplate({
        to: input?.email,
        subject,
        templateName: "sign-up",
        context,
      });
      return Utils.response({
        data: {
          email: response?.email,
          role: response?.role,
          status: response?.status,
          adminId: response?.adminId,
        },
        message: "User successfully created",
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException("User already registered");
      }
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // async createUser2(id: string, input: CreateUserDto): Promise<ResponseData> {
  //   try {
  //     const user = await this.prisma.user.findFirst({
  //       where: { email: input?.email },
  //     });
  //     if (user) throw new ConflictException("User already exits");

  //     const auto_password = `${Utils.unixTimestamp()}`;
  //     const hashed_password = await hash(auto_password, 10);

  //     const response = await this.prisma.user.create({
  //       data: {
  //         firstname: input?.firstname,
  //         lastname: input?.lastname,
  //         email: input?.email,
  //         phoneNumber: input?.phoneNumber,
  //         department: input?.department,
  //         password: hashed_password,
  //       },
  //     });

  //     const token = jwt.sign({ userId: input?.id }, process.env.JWT_SECRET, {
  //       expiresIn: "1d",
  //     });
  //     const resetLink = `${process.env.WEBSITE_URL}/reset-password/?token=${token}`;

  //     // Send reset password email
  //     // const subject = "Reset your password";
  //     // const text = `Click on the link to reset your password: ${resetLink}`;
  //     // const template =
  //     // await this.mailGunService.sendEmail(input?.email, subject, input?.template, input?.context);

  // //      async sendEmail(@Body() body: { to: string; subject: string; template: string; context: object }) {
  // //   return this.emailService.sendEmail(body.to, body.subject, body.template, body.context);
  // // }

  //     return Utils.response({
  //       data: {
  //         id: response?.id,
  //         lastname: response?.lastname,
  //         email: response?.email,
  //         phoneNumber: response?.phoneNumber,
  //         department: response?.department,
  //         role: response?.role,
  //         status: response?.status,
  //       },
  //       message: `user successfully created with reset password link sent to ${input?.email}`,
  //     });
  //   } catch (error) {
  //     throw new HttpException(error, error.status);
  //   }
  // }

  async findUsers(adminId: string, paramsObj: UserQueryArg): Promise<any> {
    // console.log("adminId", adminId);
    const pageNumber = paramsObj.pageNumber || 1;
    const pageSize = paramsObj.pageSize || 10;
    const skip = (pageNumber - 1) * pageSize;
    const orderBy = paramsObj.sortBy || "id";
    const search = paramsObj.search;
    const orderDirection = paramsObj.sortDir || "desc";

    const filterParams: object = search
      ? {
          role: {
            in: ["TEAMMATE", "OBSERVER"], // Check for both TEAMMATE and OBSERVER roles
          },
          adminId, // Only include users created by this admin
          OR: [
            { firstname: { contains: search, mode: "insensitive" } },
            { lastname: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { status: { contains: search, mode: "insensitive" } },
          ],
        }
      : {
          role: {
            in: ["TEAMMATE", "OBSERVER"], // Check for both TEAMMATE and OBSERVER roles
          },
          adminId,
        };

    const userCount = await this.prisma.user.aggregate({
      where: {
        role: {
          in: ["TEAMMATE", "OBSERVER"],
        },
        adminId,
      },
      _count: true,
    });

    const users = await this.prisma.user.findMany({
      take: Number(pageSize + 1),
      skip,
      where: filterParams,
      select: {
        id: true,
        adminId: true,
        email: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        department: true,
        loggedInActivity: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
    });

    const hasNextPage = users.length > pageSize;
    const edges = hasNextPage ? users.slice(0, pageSize) : users;
    const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
    const totalPages = Math.ceil(users.length / pageSize);
    const sortBy = orderBy;
    const q = paramsObj.search;
    const totalItems = userCount?._count;
    const sortDir = orderDirection;

    return {
      meta: {
        q,
        sortBy,
        sortDir,
        pageSize,
        pageNumber,
        hasNextPage,
        endCursor,
        totalPages,
        totalItems,
      },
      data: edges,
    };
  }

  async findUsersOld(paramsObj: UserQueryArg): Promise<any> {
    const pageNumber = paramsObj.pageNumber || 1;
    const pageSize = paramsObj.pageSize || 10;
    const skip = (pageNumber - 1) * pageSize;
    const orderBy = paramsObj.sortBy || "id";
    const search = paramsObj.search;
    const orderDirection = paramsObj.sortDir || "desc";

    const filterParams: object = search
      ? {
          role: "USER",
          OR: [
            { firstname: { contains: search, mode: "insensitive" } },
            { lastname: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
            { department: { contains: search, mode: "insensitive" } },
          ],
        }
      : {
          role: "USER",
        };

    const userCount = await this.prisma.user.aggregate({
      where: {
        role: "USER",
      },
      _count: true,
    });

    const users = await this.prisma.user.findMany({
      take: Number(pageSize + 1),
      skip,
      where: filterParams,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        department: true,
        loggedInActivity: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
    });

    const hasNextPage = users.length > pageSize;
    const edges = hasNextPage ? users.slice(0, pageSize) : users;
    const endCursor = hasNextPage ? edges[pageSize - 1].id : null;
    const totalPages = Math.ceil(users.length / pageSize);
    const sortBy = orderBy;
    const q = paramsObj.search;
    const totalItems = userCount?._count;
    const sortDir = orderDirection;

    return {
      meta: {
        q,
        sortBy,
        sortDir,
        pageSize,
        pageNumber,
        hasNextPage,
        endCursor,
        totalPages,
        totalItems,
      },
      data: edges,
    };
  }

  async findUser(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async transferRole(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    const userUpdate = this.prisma.user.update({
      where: { id },
      data,
    });

    if (data.role && data.role != user.role) {
      const appName = process.env.APP_NAME;
      const subject = `Your Role in ${appName} Has Been Updated!`;
      const templateName = "role-changed";
      const context = {
        appName,
        newRole: data.role,
        user: user?.firstname || "there",
      };
      await this.mailGunService.sendEmailWithTemplate({
        to: user.email,
        subject,
        templateName,
        context,
      });
    }

    return userUpdate;
  }

  async removeUsers(ids: string[]): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        // role: "USER",
        role: {
          in: ["TEAMMATE", "OBSERVER"],
        },
        id: {
          in: ids,
        },
      },
    });
  }

  async updateOrganizationDetails(
    id: string,
    data: UpdateOrgDto
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        organization: {
          update: {
            orgName: data?.orgName,
            orgEmail: data?.orgEmail,
            orgWebsite: data?.orgWebsite,
            orgAddress: data?.orgAddress,
            logoUrl: data?.logoUrl,
            themeColor: data?.themeColor,
          },
        },
      },
      include: {
        organization: true,
      },
    });
  }

  async updateThemeColor(id: string, data: UpdateOrgDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        organization: {
          update: {
            themeColor: data?.themeColor,
          },
        },
      },
      include: {
        organization: true,
      },
    });
  }

  async updateCompanyLogo(id: string, logoUrl: string): Promise<ResponseData> {
    try {
      const response = await this.prisma.user.update({
        where: { id },
        data: {
          organization: {
            update: {
              logoUrl: logoUrl,
            },
          },
        },
        include: {
          organization: true,
        },
      });
      return Utils.response({
        data: {
          logoUrl: response?.organization?.logoUrl,
        },
        message: "logo successfully updated",
      });
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
