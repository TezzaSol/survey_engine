// auth/auth.service.ts
import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";
import { Role, Status, User } from "@prisma/client";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateUserDto } from "./dtos/create-admin.dto";
import { compare, hash } from "bcryptjs";
import {
  LoginUserDto,
  PasswordResetDto,
  ChangePassDto,
  TwoFADto,
} from "./dtos/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { Utils } from "../../shared/utils";
import { ResponseData } from "../../shared/interfaces";
import { MailGunService } from "../../shared/services/mailgun.service";
import * as jwt from "jsonwebtoken";
import moment from "moment";
import { CreateAdminDto } from "./dtos/new-create-admin.dto";
import * as geoip from "geoip-lite"; // Optional: for IP-based location tracking
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    public jwtService: JwtService,
    private mailGunService: MailGunService,
  ) {}

  async getUserProfile(id: string): Promise<ResponseData> {
    // console.log(id);
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        department: true,
        role: true,
        organization: true,
        adminId: true,
        themeColor: true,
        trialStartDate: true,
        payments: {
          select: {
            billingCycle: true,
            plan: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1, // Limits to only the latest payment
        },
        platforms: true,
        // payments: true,
        // payments: {
        //   select:{
        //     billingCycle: true
        //   }
        // }
      },
    });
    let admin;
    if (user?.role != "ADMIN") {
      admin = await this.prisma.user.findFirst({
        where: { id: user?.adminId },
        select: {
          organization: true,
        },
      });
    }
    const response = { user, ...admin };
    return Utils.response({
      data: response,
    });
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<ResponseData> {
    try {
      // find user by email
      const user = await this.prisma.user.findFirst({
        where: { email: loginUserDto.email },
      });

      // I check if user exists
      if (!user) {
        throw new NotFoundException("Incorrect email or password.");
      }

      // I check if password is correct by comparing it with the hashed password in the database
      if (!(await compare(loginUserDto.password, user.password))) {
        throw new UnauthorizedException("Incorrect email or password.");
      }

      const payload = { sub: user?.id, email: user?.email, roles: user?.role };

      return Utils.response({
        data: {
          id: user?.id,
          email: user?.email,
          firstname: user?.firstname,
          lastname: user?.lastname,
          phoneNumber: user?.phoneNumber,
          department: user?.department,
          role: user?.role,
          createdAt: user?.createdAt,
          access_token: await this.jwtService.signAsync(payload),
        },
      });
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async registerSUperAdminUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // create new user using prisma client
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto?.email,
          password: await hash(createUserDto?.password, 10), // hash user's password
          firstname: createUserDto?.firstname,
          lastname: createUserDto?.lastname,
          phoneNumber: createUserDto?.phoneNumber,
          department: createUserDto?.department,
          role: Role.ADMIN,
          organization: {
            create: {
              orgName: createUserDto?.orgName,
              orgEmail: createUserDto?.orgEmail,
              orgWebsite: createUserDto?.orgWebsite,
              orgAddress: createUserDto?.orgAddress,
              logoUrl: createUserDto?.logoUrl,
              themeColor: createUserDto?.themeColor,
            },
          },
        },
        include: {
          organization: true,
        },
      });

      // remove password from response
      delete newUser.password;

      return newUser;
    } catch (error) {
      // check if email already registered and throw error
      if (error.code === "P2002") {
        throw new ConflictException("Email already registered");
      }

      // throw error if any
      throw new HttpException(error, error.status);
    }
  }

  async createAdmin(createUserDto: CreateUserDto) {
    try {
      const { email, firstname, lastname, country } = createUserDto;

      const userExists = await this.prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        throw new BadRequestException("Email already registered");
      }

      // Set expiration time for the verification code to 15 minutes from now
      const verificationCode = Math.floor(1000 + Math.random() * 9000); // generate a 4 digit unique verification code
      const verificationLink = `${process.env.WEBSITE_URL}/verify-email?email=${email}&code=${verificationCode}`;

      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: await hash(createUserDto?.password, 10),
          firstname,
          lastname,
          country,
          verificationCode,
          isVerified: false,
          status: "ACTIVE",
        },
      });

      // Send the verification code via email
      const appName = process.env.APP_NAME;
      const subject = `Welcome to ${appName}! Please verify your email`;
      const html = `Proceed to verify your email with this link: ${verificationLink} <br>
                    It will expire in 15 minute.<br>
                    Your verification code is ${verificationCode}`;

      // await this.mailGunService.sendEmail(newUser.email, subject, html);
      const context = {
        resetPasswordLink: verificationLink,
        verificationCode,
        appName,
        user: newUser?.firstname || "there",
      };
      await this.mailGunService.sendEmailWithTemplate({
        to: newUser.email,
        subject,
        templateName: "sign-up",
        context,
      });
      // remove password from response
      delete newUser.password;

      return newUser;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async verifyUser(verificationCode: number) {
    const EXPIRATION_TIME_IN_MINUTES = 15; // Expiration time is 15 minutes

    const user = await this.prisma.user.findFirst({
      where: { verificationCode },
    });

    if (!user) {
      throw new BadRequestException("Invalid verification code");
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException("Invalid verification code");
    }

    // Calculate the time difference
    const timeElapsedInMinutes =
      (new Date().getTime() - user.verificationCodeExpiry.getTime()) /
      (1000 * 60);

    console.log(timeElapsedInMinutes, " minutes have passed");

    // const expirationTime = moment().add(15, "minutes"); // Add 15 minutes to current time

    // Check if the code has expired (15-minute window)
    if (timeElapsedInMinutes > EXPIRATION_TIME_IN_MINUTES) {
      throw new BadRequestException("Verification code has expired");
    }

    // Mark the user as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null, // Optionally clear the verification code
      },
    });

    return { message: "Email verified successfully" };
  }

  async resendVerificationCode(createAdminDto: CreateAdminDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: createAdminDto?.email },
      });

      if (!user) {
        throw new BadRequestException("User not found");
      }

      if (user.isVerified) {
        throw new BadRequestException("Email is already verified");
      }

      // Generate a new 4-digit unique verification code
      const newVerificationCode = Math.floor(1000 + Math.random() * 9000);
      const verificationLink = `${process.env.WEBSITE_URL}/verify-email?email=${createAdminDto?.email}&code=${newVerificationCode}`;

      // Update the user with the new verification code
      await this.prisma.user.update({
        where: { email: createAdminDto?.email },
        data: {
          verificationCode: newVerificationCode,
          verificationCodeExpiry: new Date(),
        },
      });

      // Send the new verification code via email
      const subject = "Resend Verification Code";
      const html = `Your new verification code is ${newVerificationCode}. It will expire in 15 minute.<br>
                  You can also verify using this link: ${verificationLink}`;

      await this.mailGunService.sendEmail(user.email, subject, html);

      return {
        message: "A new verification code has been sent to your email.",
      };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async login(
    ip: string,
    userAgent: string,
    loginUserDto: LoginUserDto,
  ): Promise<ResponseData> {
    try {
      let location = "Unknown Location";

      // Optionally get location based on IP
      if (ip) {
        const geo = geoip.lookup(ip);
        if (geo) {
          location = `${geo.city}, ${geo.country}`;
        }
      }

      const user = await this.prisma.user.findUnique({
        where: { email: loginUserDto?.email },
        include: { platforms: true },
      });

      if (!user || !(await compare(loginUserDto?.password, user.password))) {
        throw new UnauthorizedException("Invalid credentials");
      }

      if (user.isAccountArchived) {
        throw new UnauthorizedException(
          "Access Denied. This account has been archived. Kindly contact the customer care to reactivate your account.",
        );
      }

      // Check if the user's email is verified
      if (!user.isVerified) {
        throw new UnauthorizedException(
          "Email not verified. Please check your email for the verification link.",
        );
      }

      if (user.isTwoFactorCodeActive) {
        await this.enableTwoFactorAuthAndSendCode(user.id);
      }

      // Check if user is already on a trial
      if (!user.trialStartDate) {
        const trialStartDate = moment().toDate();
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            trialStartDate,
            subscriptionPlan: "BASIC",
            isTrialActive: true,
          },
        });
      }

      // Calculate if the trial is not active
      if (!user.isTrialActive) {
        throw new UnauthorizedException(
          "Your trial period has ended. Please subscribe to continue..",
        );
      }

      // Calculate if the trial is still active
      const trialEndDate = moment(user.trialStartDate).add(14, "days");
      //console.log("trialStartDate", user.trialStartDate);
      //console.log("trialEndDate", trialEndDate);
      const now = moment();

      if (now.isAfter(trialEndDate)) {
        throw new UnauthorizedException(
          "Your trial period has ended. Please subscribe to continue.",
        );
      }

      if (user.loggedInActivity) {
        await this.trackLoginActivity(user.id, ip, userAgent);
      }

      const payload = { sub: user.id, email: user.email };

      return Utils.response({
        data: {
          id: user?.id,
          adminId: user?.adminId,
          email: user?.email,
          firstname: user?.firstname,
          lastname: user?.lastname,
          country: user?.country,
          role: user?.role,
          createdAt: user?.createdAt,
          trialStartDate: user?.trialStartDate,
          isTrialActive: user?.isTrialActive,
          loggedInActivity: user?.loggedInActivity,
          isTwoFactorCodeActive: user?.isTwoFactorCodeActive,
          isAccountArchived: user?.isAccountArchived,
          themeColor: user.themeColor || {
            // Return default if themeColor is missing
            primaryColor: "#373737",
            secondaryColor: "#AA0028",
          },
          platforms: user.platforms,
          access_token: await this.jwtService.signAsync(payload),
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status);
    }
  }

  async trackLoginActivity(
    userId: any,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    let location = "Unknown Location";
    if (ip) {
      const geo = geoip.lookup(ip);
      if (geo) {
        location = `${geo.city}, ${geo.country}`;
      }
    }

    const loginActivity = {
      userId: userId || "Anonymous", // Store 'Anonymous' for failed login attempts
      loginTime: moment().toDate(),
      ipAddress: ip?.toString(),
      deviceInfo: userAgent,
      location,
    };

    // Store login activity in the database
    await this.prisma.loginActivity.create({
      data: {
        ...loginActivity,
      },
    });

    const subject = "New Login Activity";
    const html = `These are the details of the recent login activities: <br /> ${JSON.stringify(loginActivity)}.`;

    // Send the 2FA code to the user's email
    await this.mailGunService.sendEmail(user.email, subject, html);
  }

  /**
   * Enables 2FA for the user and sends a 2FA code via email.
   * @param userId - The ID of the user.
   */
  async enableTwoFactorAuthAndSendCode(userId: string): Promise<ResponseData> {
    // Generate a secret for TOTP (Time-based One-Time Password)
    const secret = speakeasy.generateSecret({ name: "TezzaSurveyEngine" });

    // Store the secret in the database for future verification
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorCodeActive: true,
        twoFactorCode: secret.base32, // Store base32-encoded secret
      },
    });

    // Generate the 2FA code (one-time code)
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    // Send the 2FA code to the user's email
    const subject = "Your 2FA Code";
    const html = `Your 2FA code is: ${token}.`;

    // Send the 2FA code to the user's email
    await this.mailGunService.sendEmail(user.email, subject, html);

    // if (!user.isTwoFactorCodeActive){
    //       return null;
    // }else{
    return { message: `2FA enabled, code sent to ${user.email}` };

    // }
  }

  /**
   * Verifies the 2FA code provided by the user during login.
   * @param userId - The ID of the user.
   * @param token - The 2FA code entered by the user.
   */
  // async verifyTwoFactorAuth(userId: string, token: string): Promise<boolean> {
  async verifyTwoFactorAuth(
    userId: string,
    // token: string
    twoFADto: TwoFADto,
  ): Promise<ResponseData> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isTwoFactorCodeActive || !user.twoFactorCode) {
      throw new Error("Two-factor authentication is not enabled for this user");
    }

    // Verify the 2FA code against the stored secret
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorCode,
      encoding: "base32",
      token: twoFADto.twoFactorCode, // The OTP token provided by the user
      window: 1, // Allow 30 seconds leeway (for clock drift)
    });

    console.log("verified", verified);

    // Check if 2FA is enabled for the user
    if (user.isTwoFactorCodeActive) {
      if (!twoFADto.twoFactorCode) {
        throw new UnauthorizedException(
          "Two-factor authentication code is required",
        );
      }

      if (!verified) {
        throw new UnauthorizedException(
          "Invalid two-factor authentication code",
        );
      }
    }

    return { message: "2FA Sucessfully verified" }; //verified;
  }

  /**
   * Enables 2FA for a user and returns the QR code data URL.
   */
  async enableTwoFactorAuthWithQRCode(userId: string) {
    // Generate a secret key
    const secret = speakeasy.generateSecret({ name: "YourAppName" });

    // Store the secret in the database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorCodeActive: true,
        twoFactorCode: secret.base32, // Store the base32-encoded secret
      },
    });

    // Generate a QR code that the user can scan with an authenticator app
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCodeUrl, // This is the QR code image that can be displayed on the frontend
    };
  }

  // Update user with a new 2FA code and expiry time
  async sendTwoFactorCodeOld(user: any): Promise<ResponseData> {
    try {
      // // Generate a 6-digit 2FA code
      const twoFactorCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      // Set expiry time for the code (15 minutes)
      const twoFactorExpiry = moment().add(15, "minutes").toDate();

      // Save the 2FA code and expiry in the database (in user's record)
      await this.prisma.user.update({
        where: { id: user.sub },
        data: {
          twoFactorCode,
          twoFactorExpiry,
          isTwoFactorCodeActive: true,
        },
      });

      const subject = "Your 2FA Code";
      const html = `Your 2FA code is: ${twoFactorCode}. It will expire in 15 minutes.`;

      // Send the 2FA code to the user's email
      await this.mailGunService.sendEmail(user.email, subject, html);

      return { message: "2FA code sent successfully" };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async verifyTwoFactorCodeOld(
    user: any,
    twoFADto: TwoFADto,
  ): Promise<ResponseData> {
    try {
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      // Get the user's stored 2FA code and expiry time
      const userWithTwoFactor = await this.prisma.user.findUnique({
        where: { id: user?.sub },
      });

      // Check if the code matches and has not expired
      if (
        userWithTwoFactor.twoFactorCode !== twoFADto.twoFactorCode ||
        new Date(userWithTwoFactor.twoFactorExpiry) < new Date()
      ) {
        //  await this.prisma.user.update({
        //    where: { id: user.sub },
        //    data: {
        //      isTwoFactorCodeActive: false,
        //    },
        //  });

        throw new HttpException(
          "Invalid or expired 2FA code",
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2FA success - clear the 2FA code from the database
      //await this.clearTwoFactorCode(user.sub);
      return { message: "2FA verified successfully" };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  // Find user by ID (including 2FA code and expiry)
  async findUserById(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        twoFactorCode: true,
        twoFactorExpiry: true,
      },
    });
  }

  // Clear 2FA code after verification
  async disableTwoFactorAuth(userId: string): Promise<ResponseData> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorCode: null,
        isTwoFactorCodeActive: false,
      },
    });

    return { message: "2FA Auth Successfully disabled" };
  }

  //////////////

  async refreshToken(token: string) {
    const payload = this.jwtService.verify(token);
    return { access_token: this.jwtService.sign(payload) };
  }

  async deleteUser(id: string): Promise<string> {
    try {
      // find user by id. If not found, throw error
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      // delete user using prisma client
      await this.prisma.user.delete({
        where: { id },
      });

      return `user with id ${user.id} deleted`;
    } catch (error) {
      // check if user not found and throw error
      if (error.code === "P2025") {
        throw new NotFoundException(`user with id ${id} not found`);
      }

      // throw error if any
      throw new HttpException(error, 500);
    }
  }

  async sendResetPasswordEmail(passwordResetDto: PasswordResetDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: passwordResetDto.email },
    });
    if (!user) {
      throw new UnauthorizedException("invalid email address");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const resetLink = `${process.env.WEBSITE_URL}/reset-password/?token=${token}`;

    // Send reset password email
    // console.log("USER: ", user);
    const subject = "Reset your password";
    const context = { user: user?.firstname || "there", resetLink };
    const templateName = "forgot-password";
    await this.mailGunService.sendEmailWithTemplate({
      to: passwordResetDto.email,
      subject,
      templateName,
      context,
    });

    return Utils.response({
      message: `password reset link with instructions has been sent to '${passwordResetDto.email}`,
    });
  }

  async resetPassword(changePassDto: ChangePassDto) {
    try {
      const decoded = this.jwtService.verify(changePassDto.token);
      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException("Invalid token");
      }
      const userId = decoded.userId;

      const hashedPassword = await hash(changePassDto.password, 10); // hashed user's password

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          status: Status.ACTIVE,
        },
      });

      delete updatedUser.password;

      return Utils.response({
        message: "Password reset successfully",
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
