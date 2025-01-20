import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Request,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Public } from "../../common/decorators/public.decorator";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Public()
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll(@Request() req, @Query("npsType") npsType?: string) {
    const userId = req.user.sub;
    return this.reviewService.findAll(userId, npsType);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewService.findOne(id);
  }

  @Public()
  @Patch(":id")
  @Put(":id")
  update(@Param("id") id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reviewService.remove(id);
  }
}
