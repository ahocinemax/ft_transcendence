import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FriendService {
    constructor(private readonly prisma: PrismaService) {}

    async getFriend(name: string) {
        try {
            const friend = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    friends: true, 
                },
            });
            return friend?.friends!;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to find friend by name',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async addFriend(name: string, friend: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const friendUser = await this.prisma.user.findUnique({
                where: {
                    name: friend,
                },
            });
            if (!user || !friendUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const friendAdded = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    friends: {
                        connect: {
                            name: friend,
                        },
                    },
                },
            });
            return friendAdded;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to add friend',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async deleteFriend(name: string, friend: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const friendUser = await this.prisma.user.findUnique({
                where: {
                    name: friend,
                },
            });
            if (!user || !friendUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const friendDeleted = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    friends: {
                        disconnect: {
                            name: friend,
                        },
                    },
                },
            });
            return friendDeleted;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to delete friend',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
