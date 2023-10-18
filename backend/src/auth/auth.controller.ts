import { Body, Controller, Get, Post, Req, Res, UseGuards, Logger } from "@nestjs/common";
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
import cookieParser from "cookie-parser";


@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private Auth42: Auth42Service,
		private userService: UserService,
		private googleAuthService: GoogleAuthService,
		private readonly WebsocketGateway: WebsocketGateway,
	) {}
	private logger: Logger = new Logger('Auth Controller');
	@Get("getuserbytoken")
	async getUserByToken(@Req() req: Request) { return await this.authService.getUserByToken(req); }

	@Post("Oauth42")
	async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
	 await this.authService.handleDataBaseCreation(req, res, UserDto);
	}

	@Get("callback")
	async getToken(@Req() req: Request, @Res() res: Response) {
		const codeFromApi = req.query.code as string;
		const token = await this.Auth42.getAccessToken(codeFromApi);
		const user42infos = await this.Auth42.access42UserInformation(token.access_token);
 
		this.authService.createCookiesFortyTwo(res, token);
		const userExists = await this.authService.getUserByEmail(user42infos.email);
		this.authService.RedirectionUser(req,res, userExists?.email);
	}

	@Get("logout") 
	async deleteCookies(@Req() req: Request, @Res() res: Response) {
		//console.log(res);
		await this.authService.deleteCookies(res);
		this.logger.log("Log out", req.cookies);
		this.WebsocketGateway.offlineFromService(req.cookies.id);
	}

	@Get("token")
	async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
		return this.authService.checkIfTokenValid(req, res);
	}
	
	@Get("OAuth")
	@UseGuards(AuthGuard('google'))
	async getGoogleAuthToken(@Req() req: Request, @Res() res: Response){
		console.log("Request query (code from GoogleOAuth):", req.query);
		//const user = await this.googleAuthService.createDataBaseGoogleAuth(
		//	googleUser.email,
		//	googleUser.accessToken,
		//	googleUser.userName,
		//	false,
		//);
	}

	@Get('google/callback')
	async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
		const code = req.query.code as string;
		
		const googleUser: any = await this.googleAuthService.getGoogleUser(code);
		//console.log("googleUser", googleUser);
		this.authService.createCookiesGoogle(res, googleUser);
		//this.authService.updateCookies(res, googleUser.accessToken, userAlreadyRegisterd);
		//console.log("googleUser", googleUser);
		
		//const user = await this.googleAuthService.createDataBaseGoogleAuth(
		//	googleUser.email,
		//	googleUser.accessToken,
		//	googleUser.userName,
		//	false
		//);

		//console.log("auth.controller(GoogleAuth-callback)")
	//	if (process.env.NODE_ENV === 'development') {
	//		res.redirect("/user");
	//	}
	//	else if (process.env.NODE_ENV === 'production') {
	//		res.status(301).redirect(process.env.CLIENT_CREATE);
	//	}
		const userExists = await this.authService.getUserByEmail(googleUser.email);
		this.authService.RedirectionUser(req,res, userExists?.email);	
		this.WebsocketGateway.onlineFromService(googleUser.id);
	}	
}