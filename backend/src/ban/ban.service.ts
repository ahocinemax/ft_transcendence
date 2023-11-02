import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BanService {
    constructor(private readonly prisma: PrismaService) {}

    async getBanUser(userName: string) {
        try {
            const banUser = await this.prisma.user.findFirst({
                where: {
                    name: userName,
                },
                include: {
                    chanBanned: true, 
                },
            });
            return banUser?.chanBanned!;
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

    async banUser(userName: string, banUser: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: userName,
                },
            });
            const bannedUser = await this.prisma.user.findUnique({
                where: {
                    name: banUser,
                },
            });
            if (!user || !bannedUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const banAdded = await this.prisma.user.update({
                where: {
                    name: userName,
                },
                data: {
                    chanBanned: {
                        connect: {
                            name: banUser,
                        },
                    },
                },
            });
            return banAdded;
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
}