import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

type GoogleUser = {
  id: string;
  email: string;
  userName: string;
  accessToken: string;
};

@Injectable({})
export class GoogleAuthService {
  constructor(
    private prisma: PrismaService, 
    private userService: UserService,
  ) {}

  async validateUser(payload: GoogleUser): Promise<any> {
    let user = await this.prisma.user.findUnique({
      where: { name: payload.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: payload.userName,
          email: payload.email,
          accessToken: payload.accessToken,
          login42: "google account",
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: payload.accessToken,
        },
      });
    }

    return user;
  }
}