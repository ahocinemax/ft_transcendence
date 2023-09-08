import { Injectable, HttpStatus, HttpException, Req, Res, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import axios from 'axios';


type GoogleUser = {
    id: string;
    email: string;
    userName: string;
    accessToken: string;
    isRegistered: boolean
};

@Injectable({})
export class GoogleAuthService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
    ) { }

    async createDataBaseGoogleAuth(
        email: string,
        token: string,
        name: string,
        isRegistered: boolean
    ) {
        try {
            //check if user is already logged or not
            let userAlreadyRegisterd = await this.prisma.user.findUnique({
                where: {
                    email: email,
                }
            });

            if (userAlreadyRegisterd) {
                // renew infomarion of user already registered
                userAlreadyRegisterd = await this.prisma.user.update({
                    where: {
                        email: email,
                    },
                    data: {
                        achievements: userAlreadyRegisterd.achievements || [], // すでにある成果を保持する
                        accessToken: token,
                        name: name,
                        login42: "google account",
                        isRegistered: isRegistered
                    }
                });
                return userAlreadyRegisterd;
            } else {
                // create new user
                const user = await this.prisma.user.create({
                    data: {
                        achievements: [],
                        email: email,
                        accessToken: token,
                        name: name,
                        login42: "google account",
                        isRegistered: isRegistered
                    }
                });
                return user;
            }
        } catch (error) {
            console.error("Error during database operation:", error);
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Error to create the user to the database (GoogleOAuth)",
            }, HttpStatus.BAD_REQUEST);
        }
    }
    async getGoogleUser(code: string): Promise<any> {
        const accessToken = await this.getAccessTokenFromCode(code);
        const response = await this.getUserInfoFromAccessToken(accessToken);
        const googleUser: GoogleUser = {
            id: response.sub,
            email: response.email,
            userName: response.name,
            accessToken: accessToken,
            isRegistered: true
        };
        return googleUser;
    }

    // GoogleAuthService クラス内に以下のメソッドを追加

    async getAccessTokenFromCode(code: string): Promise<string> {
        const tokenEndpoint = 'https://oauth2.googleapis.com/token';

        const response = await axios.post(tokenEndpoint, {
            client_id: process.env.GOOGLE_CLIENT_ID, // 環境変数または ConfigService から取得
            client_secret: process.env.GOOGLE_CLIENT_SECRET, // 環境変数または ConfigService から取得
            redirect_uri: process.env.GOOGLE_REDIRECT_URI, // 環境変数または ConfigService から取得
            grant_type: 'authorization_code',
            code: code
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        if (response.data && response.data.access_token) {
            return response.data.access_token;
        } else {
            throw new Error('Failed to get access token');
        }
    }

    async getUserInfoFromAccessToken(accessToken: string): Promise<any> {
        const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';
        const response = await axios.get(userInfoEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.data) {
            return response.data;
        } else {
            throw new Error('Failed to get user info');
        }
    }

}