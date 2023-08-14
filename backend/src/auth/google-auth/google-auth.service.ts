import { Injectable, HttpStatus, HttpException, Req, Res, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';


@Injectable()
export class GoogleAuthService{
  async login(user: User | undefined): Promise<Token> {
    if (user === undefined) {
      throw new InternalServerErrorException(
        `Googleからユーザー情報が渡されていませんね? ${user}`
      );
    }
    console.log("Googleから渡されたユーザーの情報です。", user);

    return {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
  }
}

//type GoogleUser = {
//  id: string;
//  email: string;
//  userName: string;
//  accessToken: string;
//  };
//  
// @Injectable({})
// export class GoogleAuthService {
  // constructor(
    // private prisma: PrismaService, 
    // private userService: UserService,
  // ) {}
// 
  // async createDataBaseGoogleUser(
    // @Res() res: Response,
    // name: string,
    // isRegistered: boolean,
    // googleUser: any
  // ) {
    // try {
    // const user = await this.prisma.user.create({
        // data: {
          // name: name,
          // email: res.email,
          // accessToken: res.accessToken,
          // login42: "google account",
        // },
      // });
      // console.log(user);
      // return user; 
    // }
    // catch(error) {
      // throw new HttpException(
        // {
          // status: HttpStatus.BAD_REQUEST,
          // error: "Error to create the user to the database((GoogleOAuth)",
        // }, HttpStatus.BAD_REQUEST);
  // };
  // }
// }