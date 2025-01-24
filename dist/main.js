"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const express_handlebars_1 = require("express-handlebars");
const Handlebars = __importStar(require("handlebars"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const partialsDir = path.join(__dirname, "..", "views", "partials");
    fs.readdirSync(partialsDir).forEach((file) => {
        const filePath = path.join(partialsDir, file);
        const partialName = path.basename(file, ".hbs");
        const partialTemplate = fs.readFileSync(filePath, "utf8");
        Handlebars.registerPartial(partialName, partialTemplate);
    });
    app.engine("hbs", (0, express_handlebars_1.engine)({
        extname: ".hbs",
        defaultLayout: false,
        layoutsDir: path.join(__dirname, "..", "views", "layouts"),
        partialsDir: partialsDir,
    }));
    app.setBaseViewsDir(path.join(__dirname, "..", "views"));
    app.useStaticAssets(path.join(__dirname, "..", "public"));
    app.setViewEngine("hbs");
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Median")
        .setDescription("Tezza Survey API description")
        .setVersion("0.1")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map