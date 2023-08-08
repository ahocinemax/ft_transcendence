import { BadRequestException, Body, HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Request, Response, request } from "express";
import { Auth42Service } from "src/auth/auth42/auth42.service";
import { PrismaService } from "../../prisma/prisma.service";
import { UserDto } from "./dto/user.dto";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private Auth42: Auth42Service,
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
        coalition: user42.coalition,
        achievements: [],
        accessToken: token,
        isRegistered: isRegistered,
        user42Name: user42.login,
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
    const user42infos = await this.Auth42.access42UserInformation(token);
    if (user42infos)
      {
        const finalUser = await this.Auth42.createDataBase42User(    user42infos,
        token,
        req.body.name,
        req.body.isRegistered);
        return res.status(200).json({
        statusCode: 200,
        path: finalUser,
      });
    }
  }

  async RedirectConnectingUser(
    @Req() req: Request,
    @Res() res: Response,
    email: string | null | undefined
  ) {
    if (!email) res.redirect(301, `http://e1r2p7.clusters.42paris.fr:5173/registration`);
    else res.redirect(301, `http://e1r2p7.clusters.42paris.fr:5173/`);
  }

/* CHECK FUNCTIONS */

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.token;

    const token42Valid = await this.Auth42.access42UserInformation(token); // check token from user if user is from 42
    if (!token42Valid) {
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
    try {
      const accessToken = req.cookies.token;
      const user = await this.prisma.user.findFirst({
        where: {
          accessToken: accessToken,
        },
      });
      if (!user)
      {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Error to get the user by token"},
           HttpStatus.BAD_REQUEST);
          };
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to get the user by token"},
         HttpStatus.BAD_REQUEST);
        };
  }

/* COOKIES MANAGEMENT */

  async createCookies(@Res() res: Response, token: any) {
    const cookies = res.cookie("token", token.access_token,
      {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000), // expires in 7 days
        httpOnly: true, // for security
      });
      const Googlecookies = res.cookie("FullToken", token,
      {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000), // expires in 7 days
        httpOnly: true, // for security
      });

  }

  async updateCookies(@Res() res: Response, token: any, userInfos: any) {
    try {
      if (userInfos)
      { const name = userInfos.name;
        const user = await this.prisma.user.update({where: {name: name,},
        data: {  accessToken: token.access_token,},
        });
        return user;
      }
      else
        return (null);
    } catch (error)
    {
        throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "Error to update the cookes"},
        HttpStatus.BAD_REQUEST);
    }
    }

  async deleteCookies(@Res() res: Response) {
    try {
      res.clearCookie("token").clearCookie("FullToken").end();
    } catch (error)
    {
      throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: "Error to update the cookes"},
      HttpStatus.BAD_REQUEST);
  }
  }
}

