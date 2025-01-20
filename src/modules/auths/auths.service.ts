import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreatePlatformDto } from "../platform/dto/create-platform.dto";
import { UpdatePlatformDto } from "../platform/dto/update-platform.dto";

@Injectable()
export class AuthsService {
  constructor(private prisma: PrismaService) {}

  async googleAcc(userId: string, tokens: any) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (currentUser && currentUser.role != ("ADMIN" || "TEAMMATE")) {
      return { message: "Forbidden, Not authorized" };
    }

    // only save platform by adminId
    const adminId = currentUser.adminId || currentUser.id;

    const platform = await this.prisma.platform.upsert({
      where: {
        name_userId: {
          name: "Google",
          userId: adminId,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpireAt: tokens.expiry_date?.toString(),
        updatedAt: new Date(),
      },
      create: {
        name: "Google",
        url: "",
        userId: adminId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpireAt: tokens.expiry_date?.toString(),
      },
    });

    return platform;
  }
}
