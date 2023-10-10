import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../../../prisma/prisma.service";


@Injectable()
export class Auth42Service {
  constructor(
    private prisma: PrismaService) { }

  //42API
  async getAccessToken(req: string) {
    //console.log(req);
    //console.log(process.env.API42_ID);
    //console.log(process.env.API42_SECRET);
    //console.log(process.env.API42_URI);

    try {
      const response = await fetch("https://api.intra.42.fr/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=authorization_code&client_id=${process.env.API42_ID}&client_secret=${process.env.API42_SECRET}&code=${req}&redirect_uri=${process.env.API42_URI}`,
      });
      //console.log("Status code:", response.status);
      const responseText = await response.text();
      //console.log("AccessToken(Response text):", responseText);
      const data = JSON.parse(responseText);
      //const data = await response.json();      
      if (!data) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "the user token is empty"
          },
          HttpStatus.BAD_REQUEST);
      };
      return data;
    } catch (error) {
      console.error("Error during fetch:", error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to get the user by token"
        },
        HttpStatus.BAD_REQUEST);
    };
  }

  async access42UserInformation(accessToken: string) {
    try {
      const response = await fetch("https://api.intra.42.fr/v2/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      else {
        console.log("Received a non-ok response");
      }
    }
    catch (error) {
      console.log("Fetch42 user error", error);
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
        where: {
          email: user42.email,
        }
      });
      //if user exists alredy, do update db
      if (userAlreadyRegisterd) {
        userAlreadyRegisterd = await this.prisma.user.update({
          where: {
            email: user42.email
          },
          data: {
            accessToken: token,
            isRegistered: isRegistered,
            login42: user42.login,
            name: user42.displayname,
          }
        });
        return userAlreadyRegisterd;
      }
      else {
        // console.log("user not exist");
        const user = await this.prisma.user.create({
          data: {
            accessToken: token,
            isRegistered: isRegistered,
            login42: user42.login,
            name: user42.displayname,
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