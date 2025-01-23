"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const toStream = require("buffer-to-stream");
let ImageUploadService = class ImageUploadService {
    async uploadLogo(fileName) {
        if (!fileName) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
            const upload = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            toStream(fileName.buffer).pipe(upload);
        });
    }
};
ImageUploadService = __decorate([
    (0, common_1.Injectable)()
], ImageUploadService);
exports.ImageUploadService = ImageUploadService;
//# sourceMappingURL=cloudinaryservice.js.map