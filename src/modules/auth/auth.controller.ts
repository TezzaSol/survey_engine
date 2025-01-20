// auth/auth.controller.ts
import {
  Body,
  Get,
  UseGuards,
  Request,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Query,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-admin.dto";
import {
  ChangePassDto,
  LoginUserDto,
  PasswordResetDto,
  TwoFADto,
} from "./dtos/login-user.dto";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";
import { Public } from "../../common/decorators/public.decorator";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ResponseData } from "src/shared/interfaces";
import { AuthGuard } from "../../common/guards/auth.guard";
import { UserEntity } from "../users/entities/user.entity";
import { CreateAdminDto } from "./dtos/new-create-admin.dto";
import moment from "moment"; 

@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Public()
  // @Post("login")
  // loginUser(@Body() loginUserDto: LoginUserDto): Promise<ResponseData> {
  //   return this.authService.loginUser(loginUserDto);
  // }

  @Public()
  @Post("admin/register")
  // 💡 See here. Add this decorator to add operationId
  @ApiOperation({
    summary: "Register a new admin user",
    operationId: "create",
  })
  // 💡 See here. Add this decorator to add API Success response
  @ApiResponse({
    status: 201,
    description: "Created",
    type: CreateUserDto,
  })
  // 💡 See here. Add this decorator to add API Bad Request response
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    schema: {
      example: {
        message: [
          "email must be an email",
          "email should not be empty",
          "password should not be empty",
          "name should not be empty",
        ],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  // 💡 See here. Add this decorator to add API Conflict response
  @ApiResponse({
    status: 409,
    description: "Conflict",
    schema: {
      example: {
        message: "Email already registered",
        error: "Conflict",
        statusCode: 409,
      },
    },
  })
  async registerSUperAdminUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    // call users service method to register new user
    return this.authService.registerSUperAdminUser(createUserDto);
  }

  @Public()
  @Post("signup")
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    //: Promise<User> {
    return this.authService.createAdmin(createUserDto);
  }

  @Public()
  @Post("verify-email")
  async verifyEmail(@Query("code") code: number) {
    return this.authService.verifyUser(code);
  }

  @Public()
  @Post("resend-verification-code")
  async resendVerificationCode(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.resendVerificationCode(createAdminDto);
  }

  @Public()
  @Post("login")
  login(
    @Request() req,
    @Body() loginUserDto: LoginUserDto
  ): Promise<ResponseData> {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get client IP address
    const userAgent = req.headers["user-agent"] || "Unknown Device"; // Get device info (user-agent)
    return this.authService.login(ip, userAgent, loginUserDto);
  }

  @Public()
  trackLoginActivity(@Request() req): Promise<void> {
    const user = req.user;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get client IP address
    const userAgent = req.headers["user-agent"] || "Unknown Device"; // Get device info (user-agent)
    return this.authService.trackLoginActivity(user, ip, userAgent);
  }

  // Send 2FA code to user's email
  @Post("enable-2fa-auth")
  async enableTwoFactorAuthAndSendCode(@Request() req): Promise<ResponseData> {
    const userId = req.user.sub;
    return this.authService.enableTwoFactorAuthAndSendCode(userId);
  }

  @Post("verify-2fa-auth")
  async verifyTwoFactorAuth(
    @Request() req,
    @Body()  twoFADto: TwoFADto
   // @Body() token: string
  ): Promise<ResponseData> {
    const userId = req.user.sub;
    return this.authService.verifyTwoFactorAuth(userId, twoFADto);
  }

  @Put("disable-2fa-auth")
  async disableTwoFactorAuth(@Request() req) {
    const userId = req.user.sub;
    return this.authService.disableTwoFactorAuth(userId);
  }

  // Send 2FA code to user's email
  @Post("send-2fa-code1")
  async sendTwoFactorCode(@Request() req): Promise<ResponseData> {
    const user = req.user;
    return this.authService.sendTwoFactorCodeOld(user);
  }

  // Verify 2FA code
  @Post("verify-2fa-code2")
  async verifyTwoFactorCode(
    @Request() req,
    @Body() twoFADto: TwoFADto
  ): Promise<ResponseData> {
    const user = req.user; // Assume user is authenticated
    return this.authService.verifyTwoFactorCodeOld(user, twoFADto);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req): Promise<ResponseData> {
    return this.authService.getUserProfile(req.user.sub);
  }

  @Post("refresh-token")
  async refreshToken(@Req() req: any) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException("Authorization header not found");
    }
    const token = req.headers.authorization.split(" ")[1];
    return this.authService.refreshToken(token);
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseIntPipe) id: string): Promise<string> {
    // call users service method to delete user
    return this.authService.deleteUser(id);
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.sendResetPasswordEmail(passwordResetDto);
  }

  @Public()
  @Put("reset-password")
  async resetPassword(@Body() changePassDto: ChangePassDto) {
    return this.authService.resetPassword(changePassDto);
  }
}


