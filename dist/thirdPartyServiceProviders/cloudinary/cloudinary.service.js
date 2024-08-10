"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const toStream = require("buffer-to-stream");
class CloudinaryService {
    async uploadImage(file) {
        return await new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (error !== undefined) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
            toStream(file.buffer).pipe(upload);
        });
    }
}
exports.CloudinaryService = CloudinaryService;
//# sourceMappingURL=cloudinary.service.js.map