import {
	Controller,
	Delete,
	Get,
	Post,
	Param,
	Patch,
	Req,
	Res,
	Logger
} from '@nestjs/common';
import { UserService } from './user.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Request, Response } from 'express';
//import { UpdateEmailDto, UpdateUsernameDto } from './dto';
 
const express = require('express');
const app = express();

app.use(express.json({limit: '50kb'}));
app.use(express.urlencoded({limit: '50kb', extended: true}));

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private cloudinaryService: CloudinaryService,
	) {}
	private logger: Logger = new Logger('User Controller');

	@Get()
	async getUsers(@Req() req: Request) { return this.userService.getAllUsers(); }
	
	@Get('name/:name')
	async getUserByName(@Req() req: Request) { return this.userService.getUserByName(req.params.name); }

	@Get('email/:email')
	async getUserByEmail(@Req() req: Request) { return this.userService.getUserByEmail(req.params.email); }

	@Patch(':name')
	async UpdateUser(@Req() req: Request) {
		return (req.body.image) ? this.cloudinaryService.uploadImage(req) : this.userService.updateUser(req);
	}

	@Delete('deleteall')
	async DeleteAllUsers() { return this.userService.deleteAllUsers(); }

	@Get('getLeaderboard')
	async getLeader() { return this.userService.getLeaderBoard(); }

	@Post('getGameHistory')
	async getGameHistory(@Req() req: Request) {
		return await this.userService.getGameHistory(req.body.id);
	}

	@Get('getImage/:name')
	async getImage(@Req() req: Request, @Res() res: Response) {
		const user = await this.userService.getUserByName(req.params.name);
		if (user === null) return res.status(404).send('User not found');
		if (user.image === null) return res.status(404).send('User has no image');
		return res.status(200).send(user.image as string);
	}
}
