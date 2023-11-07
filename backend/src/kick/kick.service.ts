import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class KickService {
    constructor(private readonly prisma: PrismaService) {}

    async kickUser(userName: string, kickUserName: string, channelId: number)
    {
            const user = await this.prisma.user.findUnique({ where: { name: userName } });
            const kickUser = await this.prisma.user.findUnique({ where: { name: kickUserName } });
            const channel = await this.prisma.channel.findUnique({
              where: { id: channelId },
              include: { admins: true, owners: true, members: true},
            });
            if (!user || !kickUser || !channel) {
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
                  error: 'Only channel admin can kick users'
                }, HttpStatus.BAD_REQUEST);
            }
            const isTargetOwner = channel.owners.some((owner) => owner.id === kickUser.id);
            if (isTargetOwner) {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Cannot kick channel owner'
                }, HttpStatus.BAD_REQUEST);
            }
            const isTargetAdmin = channel.admins.some((admin) => admin.id === kickUser.id);
            if (isTargetAdmin && !isOwner) {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Admin user cannot kick another admin user'
                }, HttpStatus.BAD_REQUEST);
            }
            return this.prisma.channel.update({
              where: { id: channelId },
              data: {
                members: {
                    disconnect: { id: kickUser.id }
                }
              }
            });  
        }
}