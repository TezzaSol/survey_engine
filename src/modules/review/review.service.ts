import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { PrismaService } from "../../shared/services/prisma.service";

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  private setNpsType(nps: number): string {
    if (nps <= 7) return "detractor";
    if (nps <= 8) return "passive";
  }

  async create(createReviewDto: CreateReviewDto) {
    const { nps, ...restDto } = createReviewDto;
    return this.prisma.review.create({
      data: {
        ...restDto,
        nps,
        npsType: this.setNpsType(nps),
      },
    });
  }

  async findAll(userId: string, npsType?: string) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException("User not found");
    }

    const adminId = currentUser.adminId || currentUser.id;
    if (!adminId) {
      throw new NotFoundException("Admin ID not found");
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        ...(npsType && { npsType }),
        adminId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findFirst({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    await this.findOne(id);

    return this.prisma.review.update({
      where: {
        id,
      },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
