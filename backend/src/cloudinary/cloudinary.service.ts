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
      console.log("upload step");
      console.log(process.env.CLOUDINARY_NAME);
      const uploadedResponse = await v2.uploader.upload(image, {
        upload_preset: 'ya7xyeys', 
        allowed_formats: ['jpg', 'png'],
      });
      console.log("upload success");
      const imageURL = v2.url(uploadedResponse.public_id);
      console.log("uploadedResponse:\t",uploadedResponse);
      console.log("imageURL:\t\t",imageURL);
      
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
      console.log("Error details:", error);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid File'
      }, HttpStatus.BAD_REQUEST);
    }
  }
}

