import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth42Service } from "src/auth/auth42/auth42.service";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { UserDto } from "./dto/user.dto";
import { GoogleAuthGuard } from "./google-auth/google-auth.guard";
import { User } from "@prisma/client";
import { GoogleAuthService } from "./google-auth/google-auth.service";
import { AuthGuard } from '@nestjs/passport'
import { WebsocketGateway } from "src/websocket/websocket.gateway";


@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private Auth42: Auth42Service,
		private userService: UserService,
		private googleAuthService: GoogleAuthService,
		private readonly WebsocketGateway: WebsocketGateway,
	) {}
	
	@Get("getuserbytoken")
	async getUserByToken(@Req() req: Request) {
		// console.log("auth.controller.ts:", req.route.path);
		const user = await this.authService.getUserByToken(req);
		// console.log("user", user);
		return user;
	}
	@Post("Oauth42")
	async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
	 await this.authService.handleDataBaseCreation(req, res, UserDto);
	}

	@Get("callback")
	async getToken(@Req() req: Request, @Res() res: Response) {
	  const codeFromApi = req.query.code as string;
	  const token = await this.Auth42.getAccessToken(codeFromApi);
	  console.log("token", token);
	  const user42infos = await this.Auth42.access42UserInformation(
		token.access_token
	  );
	  if (user42infos) {
		// Use the information from the 42API to create the user in the database.
		const user = await this.Auth42.createDataBase42User(user42infos, token.access_token, user42infos.login, false);
		this.authService.createCookiesFortyTwo(res, token);
		//const userAlreadyRegisterd = await this.authService.getUserByEmail(user42infos.email);
		//this.authService.updateCookies(res, token, userAlreadyRegisterd);
		console.log("Set-Cookie header(42API):\n", res.get('Set-Cookie'));
		  //this.authService.updateCookies(res, token, userAlreadyRegisterd);
		  if (process.env.NODE_ENV === 'development') {
			res.redirect("/user");
		  }
		  else if (process.env.NODE_ENV === 'production') {
			res.status(301).redirect(process.env.CLIENT_CREATE);
		  } 
		}
		else {
			// Handle the error when we do not get the user info from the 42API.
			res.status(400).json({ error: 'Unable to get the user information from the 42API.' });
		}
	}

	@Get("logout")
	async deleteCookies(@Req() req: Request, @Res() res: Response) {
		console.log(res); 
		await this.authService.deleteCookies(res);
	}

	@Get("token")
	async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
		return this.authService.checkIfTokenValid(req, res);
	}
	
	@Get("OAuth")
	@UseGuards(AuthGuard('google'))
	async getGoogleAuthToken(@Req() req: Request, @Res() res: Response){
		//console.log("Request query (code from GoogleOAuth):", req.query);
	}

	@Get('google/callback')
	async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
		const code = req.query.code as string;
		//console.log("code", code);

		const googleUser = await this.googleAuthService.getGoogleUser(code);
		this.authService.createCookiesGoogle(res, googleUser);
		//const userAlreadyRegisterd = await this.authService.getUserByEmail(googleUser.email);
		//this.authService.updateCookies(res, googleUser.accessToken, userAlreadyRegisterd);
		//console.log("googleUser", googleUser);
		const user = await this.googleAuthService.createDataBaseGoogleAuth(
			googleUser.email,
			googleUser.accessToken,
			googleUser.userName,
			false
		);

		//console.log("auth.controller(GoogleAuth-callback)")
		if (process.env.NODE_ENV === 'development') {
			res.redirect("/user");
		}
		else if (process.env.NODE_ENV === 'production') {
			res.status(301).redirect(process.env.CLIENT_CREATE);
		}
		this.WebsocketGateway.onlineFromService(user.id);
	}	
}