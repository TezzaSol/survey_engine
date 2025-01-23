/// <reference types="multer" />
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
export declare class ImageUploadService {
    uploadLogo(fileName: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse>;
}
