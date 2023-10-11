import { BadRequestException, Body, HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Request, Response, request } from "express";
import { Auth42Service } from "src/auth/auth42/auth42.service";
import { PrismaService } from "../../prisma/prisma.service";
import { UserDto } from "./dto/user.dto";
import { GoogleAuthService } from "./google-auth/google-auth.service";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private Auth42: Auth42Service,
    private googleAuthService: GoogleAuthService,
  ) {}

/* DATABASE Creation function */
async createDataBase42User(
  user42: any,
  token: string,
  username: string,
  isRegistered: boolean
) {
  try {
    const user = await this.prisma.user.create({
      data: {
        accessToken: token,
        isRegistered: isRegistered,
        login42: user42.login,
        name: username,
        email: user42.email,
      },
    });

    return user;
  } catch (error) {
    throw new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: "Error to create the user to the database"
    }, HttpStatus.BAD_REQUEST);
    };
}

  async handleDataBaseCreation(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
    const token: string = req.cookies.token;
    console.log("token", token);
    const user42infos = await this.Auth42.access42UserInformation(token);
    if (user42infos)
      {
        const finalUser = await this.Auth42.createDataBase42User(user42infos,
        token,
        req.body.name,
        req.body.isRegistered);
        return res.status(200).json({
        statusCode: 200,
        path: finalUser,
      });
    }
  }

/* CHECK FUNCTIONS */

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.access_token;
    console.log("token", token);
    console.log("req!!!!!!!!!!!!!!!!!!!!!!", req.cookies);
    const token42Valid = await this.Auth42.access42UserInformation(token); // check token from user if user is from 42
    const tokenGoogleValid = await this.googleAuthService.getUserInfoFromAccessToken(token); // check token from user if user is from Google
    if (!tokenGoogleValid && !token42Valid) {
      throw new BadRequestException("InvalidToken", {
        cause: new Error(),
        description: "Json empty, the token is invalid",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      path: request.url,
    });
  }

  /* GET FUNCTIONS */

  async getUserByToken(req: Request) {
    //console.log("request : getUserbyToken: ", req);
    try {
      const accessToken = req.cookies.access_token;
      //console.log("req.cookies.access_token(controller)", req.cookies.access_token);
      const user = await this.prisma.user.findFirst({
        where: {
          accessToken: accessToken,
        },
      });
      //console.log("user", user);
      if (!user)
      {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Error to get the user by token (user empty)"},
           HttpStatus.BAD_REQUEST);
          };
      return user;
    } catch (error) {
      console.error("Error getUserbyToken", error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.response ? error.response.error : "Error to get the user by token"
        },
         HttpStatus.BAD_REQUEST
         );
        };
  }

//COOKIES
  async createCookiesFortyTwo(@Res() res: Response, token: any) {
    console.log("token.access_token(42API)", token.access_token);
    const cookies = res.cookie("access_token", token.access_token,
      {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000),
        httpOnly: true,
      });
  }

  async createCookiesGoogle(@Res() res: Response, token: any) {
    console.log("token.access_token(Google)", token.accessToken);
      res.cookie("access_token", token.accessToken,
      {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000),
        httpOnly: true,
      });
  }

  async updateCookies(@Res() res: Response, token: any, userInfos: any) {
    try {
      if (userInfos)
      { console.log("userInfos", userInfos);
        console.log("token(updatecookies)", token.access_token);
        const name = userInfos.name;
        const user = await this.prisma.user.update({
          where: {name: name,},
          data: {  accessToken: token.access_token,},
        });
        res.cookie("access_token", token.access_token, {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000),
          httpOnly: true,
        });
        return user;
      }
      else
        return (null);
    } catch (error)
    {
        console.log("error", error);
        throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "Error to update the cookies"},
        HttpStatus.BAD_REQUEST);
    }
    }

  async deleteCookies(@Res() res: Response) {
    try {
      res.clearCookie("accessToken").clearCookie("FullToken").end();
    } catch (error)
    {
      throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: "Error to update the cookes"},
      HttpStatus.BAD_REQUEST);
  }
  }
  
  async getUserByEmail(email: string){
    try {
        const userAlreadyRegisterd = await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        return userAlreadyRegisterd;
    } catch (error) {}
}
}

