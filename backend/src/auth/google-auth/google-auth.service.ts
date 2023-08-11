import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class GoogleAuthService {
//  create(createGoogleAuthDto: CreateGoogleAuthDto) {
//    return 'This action adds a new googleAuth';
//  }

  findAll() {
    return `This action returns all googleAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} googleAuth`;
  }

//  update(id: number, updateGoogleAuthDto: UpdateGoogleAuthDto) {
//    return `This action updates a #${id} googleAuth`;
//  }

  remove(id: number) {
    return `This action removes a #${id} googleAuth`;
  }
}
