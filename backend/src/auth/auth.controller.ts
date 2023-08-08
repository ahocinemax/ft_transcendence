import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth42Service } from "src/auth/auth42/auth42.service";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { UserDto } from "./dto/user.dto";



@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private Auth42: Auth42Service,
    private userService: UserService,
  ) {}
  
  @Get("getuserbytoken")
  async getUserByToken(@Req() req: Request) {
    return await this.authService.getUserByToken(req);
  }
  @Post("Oauth")
  async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
   await this.authService.handleDataBaseCreation(req, res, UserDto);
  }

  @Get("callback")
  async getToken(@Req() req: Request, @Res() res: Response) {
    console.log("Callback endpoint called");
    console.log("Request query parameters:", req.query);
    const codeFromUrl = req.query.code as string;
    const token = await this.Auth42.getAccessToken(codeFromUrl);
    const user42infos = await this.Auth42.access42UserInformation(
      token.access_token
    );
    if (user42infos) {
      // Use the information from the 42API to create the user in the database.
      const user = await this.Auth42.createDataBase42User(user42infos, token.access_token, user42infos.login, true);
      // Respond with the user information.
      // res.json(user);
      res.redirect("/user");
    } else {
      // Handle the error when we do not get the user info from the 42API.
      res.status(400).json({ error: 'Unable to get the user information from the 42API.' });
    }
  }

  @Get("logout")
  async deleteCookies(@Req() req: Request, @Res() res: Response) {
    await this.authService.deleteCookies(res);
  }

  @Get("token")
  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkIfTokenValid(req, res);
  }
}
