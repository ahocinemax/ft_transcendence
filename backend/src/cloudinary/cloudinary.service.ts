import { Injectable, HttpException,HttpStatus } from '@nestjs/common';
import { Request} from 'express';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class CloudinaryService {
  constructor(private prisma: PrismaService) {}

  async uploadImage(req: Request) {
    const { name } = req.params;
    const image = req.body.image;

    try {
      const uploadedResponse = await v2.uploader.upload(image, {
        upload_preset: 'your_upload_preset', 
        allowed_formats: ['jpg', 'png'],
      });

      const imageURL = v2.url(uploadedResponse.public_id);

      const user = await this.prisma.user.update({
        where: {
          name,
        },
        data: {
          image: imageURL,
        },
      });

      return user;

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid File'
      }, HttpStatus.BAD_REQUEST);
    }
  }
}