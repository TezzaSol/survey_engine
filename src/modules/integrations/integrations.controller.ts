// import { Controller } from '@nestjs/common';
// import { IntegrationsService } from './integrations.service';

// @Controller('integrations')
// export class IntegrationsController {
//   constructor(private readonly integrationsService: IntegrationsService) {}
// }
import { Controller, Post, Body, Get } from "@nestjs/common";
import { CreateIntegrationDto } from "./dto/create-integration.dto";
import { PrismaService } from "../../shared/services/prisma.service";

@Controller("integrations")
export class IntegrationsController {
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
