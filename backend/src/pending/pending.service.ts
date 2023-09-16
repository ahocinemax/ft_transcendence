import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PendingService {
    constructor(private readonly prisma: PrismaService) {}
    async getPendingUser(name: string) {
        try {
            const pendingUser = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    pending: true,
                    pendingOf: true, 
                },
            });
            return pendingUser?.pending!;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to find pending user by name',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async getPendingUserOf(name: string) {
        try {
            const pendingUserOf = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    pendingOf: true,
                },
            });
            return pendingUserOf?.pendingOf!;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to find user who is in pending list by name',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
    

    async addPending(name: string, pendingUser: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const addUser = await this.prisma.user.findUnique({
                where: {
                    name: pendingUser,
                },
            });
            if (!user || !addUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const acceptAdded = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    pending: {
                        connect: {
                            name: pendingUser,
                        },
                    },
                },
            });
            return acceptAdded;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error to add pending user',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async deletePending(name: string, pendingUser: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            const deleteUser = await this.prisma.user.findUnique({
                where: {
                    name: pendingUser,
                },
            });
            if (!user || !deleteUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Error to find user or friend',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            const pendingDeleted = await this.prisma.user.update({
                where: {
                    name: name,
                },
                data: {
                    pending: {
                        disconnect: {
                            name: pendingUser,
                        },
                    },
                },
            });
            return pendingDeleted;
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
