import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable({})
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
	) {}

	async getAllUsers() {
		return await this.prisma.user.findMany();
	}

	async getUserByName(name: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					name: name,
				},
			})
			console.log(name);
			console.log(user);
			return user;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Error to find user by name',
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async deleteAllUsers() {
		try {
			const user = await this.prisma.user.deleteMany({});
			return user;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Error to delete all user',
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}
	
	async updateUser(req: Request) {
		try{
			const { name }  = req.params;
			const user = await this.prisma.user.update({
				where: {
					name,
				},
				data: req.body,
			});
			if (!user) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Error to update user',
					},
					HttpStatus.BAD_REQUEST
				);
			}
		return user;
		} catch (error) {
		throw new HttpException(
			{
				status: HttpStatus.BAD_REQUEST,
				error: 'Error to update user',
			},
			HttpStatus.BAD_REQUEST
		);
	}
	}
}