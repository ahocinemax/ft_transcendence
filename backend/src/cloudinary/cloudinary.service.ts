import { Injectable } from '@nestjs/common';
import { Request} from 'express';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { PrismaService } from 'prisma/prisma.service';
// import toStream = require('buffer-to-stream');
@Injectable()

//export class CloudinaryService {
//  async uploadImage(
//    file: Express.Multer.File,
//  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
//    
//    return new Promise((resolve, reject) => {
//      const upload = v2.uploader.upload_stream((error, result) => {
//        if (error) return reject(error);
//        resolve(result);
//      });
//    
//      toStream(file.buffer).pipe(upload);
//    });
//  }
//}
export class CloudinaryService {
    async uploadImage( req: Request ) {
        return null;
    }
}