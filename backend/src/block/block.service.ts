import { Injectable,HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BlockService {
    constructor (private readonly prisma: PrismaService) {}


    async getBlockUser(name: string) {
        try {
            const block = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    blocked: true, 
                },
            });
            return block?.blocked!;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to find user to block by name',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async getBlockUserOf(name: string) {
        try {
            const blockedOf = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    blockedOf: true,
                },
            });
            return blockedOf?.blockedOf!;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to find blocked user by name',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
    

    async blockUser(name: string, userToBlock: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const blockUser = await this.prisma.user.findUnique({
                where: {
                    name: userToBlock,
                },
            });
            if (!user || !blockUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const blockAdded = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    blocked: {
                        connect: {
                            name: userToBlock,
                        },
                    },
                },
            });
            return blockAdded;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to add block list',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async deleteBlock(name: string, blocked: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const blockUser = await this.prisma.user.findUnique({
                where: {
                    name: blocked,
                },
            });
            if (!user || !blockUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const blockDeleted = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    blocked: {
                        disconnect: {
                            name: blocked,
                        },
                    },
                },
            });
            return blockDeleted;
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

