import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { CreatePlatformDto } from "./dto/create-platform.dto";
import { UpdatePlatformDto } from "./dto/update-platform.dto";
import { User } from "@prisma/client";

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPlatformDto: CreatePlatformDto) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (currentUser && currentUser.role != ("ADMIN" || "TEAMMATE")) {
      return { message: "Forbidden, Not authorized" };
    }

    const platformNameExit = await this.prisma.platform.findFirst({
      where: { name: createPlatformDto.name, userId: userId },
    });

    if (platformNameExit)
      throw new ConflictException(
        `Platform with the name ${createPlatformDto.name} already exits`,
      );

    const adminId = currentUser.adminId || currentUser.id;

    return this.prisma.platform.create({
      data: {
        ...createPlatformDto,
        userId: adminId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.platform.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string, userId: string) {
    const platform = await this.prisma.platform.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }

    return platform;
  }

  async update(
    userId: string,
    id: string,
    updatePlatformDto: UpdatePlatformDto,
  ) {
    // First check if the platform exists and belongs to the user
    await this.findOne(id, userId);

    return this.prisma.platform.update({
      where: {
        id,
      },
      data: updatePlatformDto,
    });
  }

  async remove(userId: string, id: string) {
    // First check if the platform exists and belongs to the user
    await this.findOne(id, userId);

    return this.prisma.platform.delete({
      where: {
        id,
      },
    });
  }

  async togglePlatformStatus(userId: string, id: string) {
    const platform = await this.findOne(id, userId);

    return this.prisma.platform.update({
      where: {
        id,
      },
      data: {
        isActive: !platform.isActive,
      },
    });
  }
}
