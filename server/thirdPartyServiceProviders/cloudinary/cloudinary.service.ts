import { type UploadApiErrorResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<any | UploadApiErrorResponse> {
    return await new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
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
