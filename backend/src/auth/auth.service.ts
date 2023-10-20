import { Logger, BadRequestException, Body, HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Request, Response, request } from "express";
import { Auth42Service } from "src/auth/auth42/auth42.service";
import { PrismaService } from "../../prisma/prisma.service";
import { UserDto } from "./dto/user.dto";
import { GoogleAuthService } from "./google-auth/google-auth.service";
import { WebsocketGateway } from "src/websocket/websocket.gateway";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private Auth42: Auth42Service,
    private googleAuthService: GoogleAuthService,
    private websocketGateway: WebsocketGateway,
  ) {}

  private logger = new Logger("Auth Service");

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
    let finalUser: any;
    const user42infos = await this.Auth42.access42UserInformation(token);
    const user = await this.getUserByToken_(token);
    console.log("handleDataBaseCreation::: user", user);
    if (user) {
      this.websocketGateway.onlineFromService(UserDto.name);
      return res.status(200).json({statusCode: 200, path: user});
    }
    if (user42infos)
    {
      finalUser = await this.Auth42.createDataBase42User(user42infos,
      token,
      UserDto.name,
      UserDto.isRegistered
    );}
    else {
      try {
        const userGoogleInfos = await this.googleAuthService.getGoogleUserByCookies(req)
        if (userGoogleInfos) {
          finalUser = await this.googleAuthService.createDataBaseGoogleAuth(
          userGoogleInfos.email,
          userGoogleInfos.accessToken,
          UserDto.name,
          UserDto.isRegistered
        ) 
      }} catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Error to create the user to the database"
          }, HttpStatus.BAD_REQUEST);
      };
  }
  console.log("finalUser", finalUser);
  this.websocketGateway.onlineFromService(finalUser.name);
  return res.status(200).json({statusCode: 200, path: finalUser});
};

/* CHECK FUNCTIONS */

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.access_token;
    const token42Valid = await this.Auth42.access42UserInformation(token); // check token from user if user is from 42
    const tokenGoogleValid = await this.googleAuthService.getUserInfoFromAccessToken(token); // check token from user if user is from Google
    if (!tokenGoogleValid && !token42Valid) { // token don't match with any existing users
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
      const accessToken = req.cookies.access_token; // problem when user is not logged in => no cookie yet
      console.log("trying to reach user with accessToken: ", accessToken);
      if (accessToken === undefined) return ;
      const user = await this.prisma.user.findFirst({where: { accessToken: accessToken }});
      return user ? user : null;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error(getUserByToken:::::)", error);
      throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,error: error.response ? error.response.error : "Error to get the user by token"},
        HttpStatus.BAD_REQUEST
      );
    };
  }

  async getUserByToken_(accessToken: string) {
    try {
      if (accessToken === undefined) return ;
      const user = await this.prisma.user.findFirst({where: { accessToken: accessToken }});
      return user ? user : null;
    } catch (error) { console.log("error", error); };
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
    // console.log("token.access_token", token.accessToken);
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
      {
        // console.log("userInfos", userInfos);
        // console.log("token(updatecookies)", token.access_token);
        const name = userInfos.name;
        console.log("updating user ", name);
        const user = await this.prisma.user.update({
          where: { name: name,},
          data: { accessToken: token.access_token }
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
            where: { email: email }
        });
        return userAlreadyRegisterd;
    } catch (error) {
      console.log("error", error);
    }
}

async RedirectionUser(
  @Req() req: Request, 
  @Res() res: Response, 
  isRegistered: boolean | undefined,
  email: string | null | undefined) {
  console.log("Response cookie", res.cookie);
  if (!isRegistered) // check if user is already registerd
      res.redirect(301, "http://localhost:3000/checkuser");
    else
    {
      console.log("else:::::::::");
      //const user = await this.getUserByToken(req.cookies.access_token);
      const user = await this.getUserByEmail(email);
      //const fetchUrl = process.env.CLIENT_HOST + "user/" + user.name;
      res.redirect(301, process.env.CLIENT_HOST + "profile"); // redirect to the profile page
    }
  }
}

