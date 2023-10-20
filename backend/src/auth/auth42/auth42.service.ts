import { HttpException, HttpStatus, Injectable, Req, Res, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../../../prisma/prisma.service";


@Injectable()
export class Auth42Service {
  constructor(private prisma: PrismaService) {}
  private logger: Logger = new Logger('Auth42 Service');

  //42API
  async getAccessToken(req: string) {
    try {
      const response = await fetch("https://api.intra.42.fr/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=authorization_code&client_id=${process.env.API42_ID}&client_secret=${process.env.API42_SECRET}&code=${req}&redirect_uri=${process.env.API42_URI}`
      });
      const responseText = await response.text();
      const data = JSON.parse(responseText);
      if (!data) throw new HttpException({ status: HttpStatus.NOT_FOUND, error: "the user token is empty"}, HttpStatus.NOT_FOUND);
      return data;
    } catch (error) {
      console.error("Error during fetch:", error);
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: "Error to get the user by token"}, HttpStatus.BAD_REQUEST);
    }; 
  }

  async access42UserInformation(accessToken: string) {
    try {
      const response = await fetch("https://api.intra.42.fr/v2/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.status === 200) {
        const data = await response.json();
        return data;
      }
      else {
        this.logger.log("Cannot get 42 user info with this token"); 
      }
    }
    catch (error) {
      console.log("Fetch42 user error");
    }
    return null;
  }

  async createDataBase42User(
    user42: any,
    token: string,
    name: string,
    isRegistered: boolean
  ) {
    try {
      //check if user is already logged or not
      let userAlreadyRegisterd = await this.prisma.user.findUnique({
        where: { email: user42.email }
      });
      //if user exists alredy, do update db
      if (userAlreadyRegisterd) {
        userAlreadyRegisterd = await this.prisma.user.update({
          where: { email: user42.email },
          data: {
            accessToken: token,
            login42: user42.login,
          }
        });
        return userAlreadyRegisterd;
      }
      else {
        const user = await this.prisma.user.create({
          data: {
            accessToken: token,
            isRegistered: isRegistered,
            login42: user42.login,
            name: name,
            email: user42.email,
          }
        });
        return user;
      }
    } catch (error) {
      console.log("42api error", error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to create the user to the database((API42)"
        }, HttpStatus.BAD_REQUEST);
    };
  }
}