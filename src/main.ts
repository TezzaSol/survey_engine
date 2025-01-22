import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "path";
import * as hbs from "hbs";
import * as fs from "fs";
import { engine } from "express-handlebars";
import * as Handlebars from "handlebars";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //enable cors
  app.enableCors();

  // Global pipe that will be applied to all routes
  // This will validate the request body against the DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Check here - Swagger setup
  const partialsDir = path.join(__dirname, "..", "views", "partials");

  fs.readdirSync(partialsDir).forEach((file) => {
    const filePath = path.join(partialsDir, file);
    const partialName = path.basename(file, ".hbs");
    const partialTemplate = fs.readFileSync(filePath, "utf8");
    Handlebars.registerPartial(partialName, partialTemplate);
  });

  app.engine(
    "hbs",
    engine({
      extname: ".hbs",
      defaultLayout: false,
      layoutsDir: path.join(__dirname, "..", "views", "layouts"),
      partialsDir: partialsDir,
    })
  );

  app.setBaseViewsDir(path.join(__dirname, "..", "views"));
  app.useStaticAssets(path.join(__dirname, "..", "public"));
  app.setViewEngine("hbs");

  const config = new DocumentBuilder()
    .setTitle("Median")
    .setDescription("Tezza Survey API description")
    .setVersion("0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);


  //await app.listen(3000);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();