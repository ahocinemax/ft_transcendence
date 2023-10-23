import { Body, Controller, Get, Post, Req, Res, UseGuards, Logger } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth42Service } from "src/auth/auth42/auth42.service";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { UserDto } from "./dto/user.dto";
// import { GoogleAuthGuard } from "./google-auth/google-auth.guard";
import { User } from "@prisma/client";
import { GoogleAuthService } from "./google-auth/google-auth.service";
import { AuthGuard } from '@nestjs/passport'
import { WebsocketGateway } from "src/websocket/websocket.gateway";
// import cookieParser from "cookie-parser";

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
		let userExists: User | null = null;
		this.authService.createCookiesFortyTwo(res, token);
		if (user42infos?.email) userExists = await this.authService.getUserByEmail(user42infos.email);
		// When the name match with DB user but access token has changed, we update the access token
		if (userExists?.accessToken !== token.access_token) {
			await this.userService.updateUserAccessToken(userExists?.name, token.access_token);
			userExists = await this.authService.getUserByEmail(user42infos.email);
		}
		this.authService.RedirectionUser(req, res, userExists?.isRegistered, userExists?.email);
	}

	@Get("logout")
	async deleteCookies(@Req() req: Request, @Res() res: Response) {
		await this.authService.deleteCookies(res);
		this.logger.log("LOG OUT");
		console.log("logout access_token", req.cookies.access_token);
		const user = await this.authService.getUserByToken(req.cookies.access_token);
		if (user) this.WebsocketGateway.offlineFromService(user.name);
	}

	@Get("token")
	async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
		return this.authService.checkIfTokenValid(req, res);
	}
	
	@Get("OAuth")
	@UseGuards(AuthGuard('google'))
	async getGoogleAuthToken(@Req() req: Request, @Res() res: Response){
	}

	@Get('google/callback')
	async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
		const code = req.query.code as string;

		const googleUser: any = await this.googleAuthService.getGoogleUser(code);
		this.authService.createCookiesGoogle(req, res, googleUser);
		const userExists = await this.authService.getUserByEmail(googleUser.email);
		console.log("userExists: ", userExists);
		if (userExists && (userExists?.accessToken !== googleUser.accessToken))
			await this.authService.updateUserAccessToken(userExists?.email, googleUser.accessToken);
		this.authService.RedirectionUser(req, res, userExists?.isRegistered, userExists?.email);
	}
}