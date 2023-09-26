import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Req,
	Res,
	Logger,
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
	async getUsers(@Res() res: Response) {
		if (process.env.NODE_ENV === 'development') {
	  		const users = await this.userService.getAllUsers();
	  		res.render('users.ejs', { users });
		} // users is a .ejs file under the views directory
		else {
			return this.userService.getAllUsers();	
		}
	}
	
	@Get(':name')
	async getUserByName(@Req() req: Request) {
		return this.userService.getUserByName(req.params.name);
	}

	@Patch(':name')
	async UpdateUser(@Req() req: Request) {
		if (req.body.image) {
			//uploading image !
			const user = this.cloudinaryService.uploadImage(req);
			return user;
		}
		return this.userService.updateUser(req);
	}

	@Delete('deleteall')
	async DeleteAllUsers() {
		return this.userService.deleteAllUsers();
	}

	@Get('getLeaderboard')
	async getLeaderboard() {
		console.log('getLeaderboard log message');
		return this.userService.getLeaderBoard();
	}

	@Get('getGameHistory')
	async getGameHistory(@Req() req: Request) {
		this.logger.log('getLeaderboard log message');
		return this.userService.getGameHistory(req.body.id);
	}
}
