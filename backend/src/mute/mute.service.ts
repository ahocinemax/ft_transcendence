import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuteService {
    constructor(private readonly prisma: PrismaService) {}

    async getMuteUser(name: string) {
        try {
            const muteUser = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    muted: true, 
                },
            });
            return muteUser?.muted!;
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

    async addMuteUser(name: string, muteUser: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const mutedUser = await this.prisma.user.findUnique({
                where: {
                    name: muteUser,
                },
            });
            if (!user || !mutedUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or mute user',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const muteUserAdded = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    muted: {
                        connect: {
                            userId: mutedUser.userId,
                        },
                    },
                },
            });
            return muteUserAdded;
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to add mute user',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async deleteMutedUser(name: string, mutedUser: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const muteUser = await this.prisma.user.findUnique({
                where: {
                    name: mutedUser,
                },
            });
            if (!user || !muteUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or mute user',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const muteDeleted = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    muted: {
                        disconnect: {
                            id: muteUser.id,
                        },
                    },
                },
            });
            return muteDeleted;
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
