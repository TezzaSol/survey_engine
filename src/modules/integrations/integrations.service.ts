import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationsService {}
import { Controller, Post, Body, Get } from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { CreateIntegrationDto } from "./dto/create-integration.dto";

@Controller("integrations")
export class IntegrationController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createIntegration(@Body() createIntegrationDto: CreateIntegrationDto) {
    const integration = await this.prisma.integration.create({
      data: createIntegrationDto,
    });

    return {
      message: "Integration successfully created",
      data: integration,
    };
  }

  @Get()
  async getAllIntegrations() {
    const integrations = await this.prisma.integration.findMany();
    return {
      message: "Integrations retrieved successfully",
      data: integrations,
    };
  }
}
