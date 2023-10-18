import {
	Controller,
	Delete,
	Get,
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
	
	@Get(':name')
	async getUserByName(@Req() req: Request) { return this.userService.getUserByName(req.params.name); }

	@Get(':email')
	async getUserByEmail(@Req() req: Request) { return this.userService.getUserByEmail(req.params.email); }

	@Patch(':name')
	async UpdateUser(@Req() req: Request) {
		if (req.body.image) {
			const user = this.cloudinaryService.uploadImage(req);
			return user;
		}
		return this.userService.updateUser(req);
	}

	@Delete('deleteall')
	async DeleteAllUsers() {
		console.log('delete all received');
		return this.userService.deleteAllUsers();
	}

	@Get('getLeaderboard')
	async getLeader() {
		this.logger.log('getLeaderboard log message');
		return this.userService.getLeaderBoard();
	}

	@Get('getGameHistory')
	async getGameHistory(@Req() req: Request) {
		this.logger.log('getGameHistory log message');
		return this.userService.getGameHistory(req.body.id);
	}
}
