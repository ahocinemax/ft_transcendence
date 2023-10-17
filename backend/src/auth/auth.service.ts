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
    const token: string = req.cookies.access_token;
    console.log("handleDataBaseCreation(authservice):::::", req.cookies.access_token);
    const user42infos = await this.Auth42.access42UserInformation(token);
    //console.log("user42infos:::::::::", user42infos);
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
    else{
      try {
        const userGoogleInfos = await this.googleAuthService.getGoogleUserByCookies(req)
        console.log("userGoogleInfos::::::", userGoogleInfos);
        if (userGoogleInfos) {
          const finalUser = await this.googleAuthService.createDataBaseGoogleAuth
        (
          userGoogleInfos.email,
          userGoogleInfos.accessToken,
          userGoogleInfos.userName,
          userGoogleInfos.isRegistered,
        )
          return res.status(200).json(
          {
            statusCode: 200,
            path: finalUser,
          });
      }} catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Error to create the user to the database"
          }, HttpStatus.BAD_REQUEST);
        };
    }
};

/* CHECK FUNCTIONS */

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.access_token;
    console.log("token(checkIfTokenValid)", token);
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
    // console.log("getUserbyToken: ", req.cookies);
    try {
          //const accessToken = req.cookies.access_tokenGoogle || req.cookies.access_token42;
      const accessToken = req.cookies.access_token;
      console.log("accessToken", accessToken);
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
            status: HttpStatus.NOT_FOUND,
            error: "Error to get the user by token (user empty)"},
           HttpStatus.NOT_FOUND);
          }
      //console.log("user", user);
      return user;
    } catch (error) {
      console.error("Error getUserbyToken", error);
      if (error instanceof HttpException) {
        //console.log("error", error);
        throw error;
      }
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
  async createCookiesFortyTwo(@Req() res: Response, token: any) {
    res.cookie("access_token", token.access_token,
      {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000),
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });
  }

  async createCookiesGoogle(@Res() res: Response, token: any) {
    console.log("token.access_token", token.accessToken);
      res.cookie("access_token", token.accessToken,
      {
        expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
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
      res.clearCookie("access_token").end();
    } catch (error)
    {
      throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: "Error to update the cookies"},
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
    } catch (error) {
      console.log("error", error);
    }
}

async RedirectionUser(
  @Req() req: Request,
  @Res() res: Response,
  email: string | null | undefined
) {
  console.log("redirectionUser", email);
  if (!email) res.redirect(301, "http://localhost:3000/checkuser");
  else res.redirect(301, process.env.CLIENT_HOST);
}
}

