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

    async banUser(userName: string, banUserName: string, channelId: number)
    {
            const user = await this.prisma.user.findUnique({ where: { name: userName } });
            const banUser = await this.prisma.user.findUnique({ where: { name: banUserName } });
            const channel = await this.prisma.channel.findUnique({
              where: { id: channelId },
              include: { admins: true, owners: true, banned: true},
            });
            if (!user || !banUser || !channel) {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'User or channel not found'
                }, HttpStatus.BAD_REQUEST);
            }
            console.log("channel.admins user is:::", channel.admins);
            const isAdmin = channel.admins.some((admin) => admin.id === user.id);
            const isOwner = channel.owners.some((owner) => owner.id === user.id);
            if (!isAdmin && !isOwner) {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Only channel admin can ban users'
                }, HttpStatus.BAD_REQUEST);
            }
            const isTargetOwner = channel.owners.some((owner) => owner.id === banUser.id);
            if (isTargetOwner) {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Cannot ban channel owner'
                }, HttpStatus.BAD_REQUEST);
            }
            const isTargetAdmin = channel.admins.some((admin) => admin.id === banUser.id);
            if (isTargetAdmin && !isOwner) {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Admin user cannot ban another admin user'
                }, HttpStatus.BAD_REQUEST);
            }
            return this.prisma.channel.update({
              where: { id: channelId },
              data: {
                banned: {
                    connect: { id: banUser.id }
                }
              }
            });  
        }
}