import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuteService {
  constructor(private readonly prisma: PrismaService) {}

  async getMutedUser(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { name: username },
      include: { muted: true },
    });
    return user?.muted || [];
  }

  async addMuteUser(userName: string, mutedUserName: string, channelId: number) {
    const user = await this.prisma.user.findUnique({ where: { name: userName } });
    const mutedUser = await this.prisma.user.findUnique({ where: { name: mutedUserName } });
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { admins: true, owners: true},
    });
    if (!user || !mutedUser || !channel) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User or channel not found'
        }, HttpStatus.BAD_REQUEST);
    }
    console.log("channel.admins", channel.admins);
    const isAdmin = channel.admins.some((admin) => admin.id === user.id);
    const isOwner = channel.owners.some((owner) => owner.id === user.id);
    if (!isAdmin && !isOwner) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Only channel admin can mute users'
        }, HttpStatus.BAD_REQUEST);
    }
    const isTargetOwner = channel.owners.some((owner) => owner.id === mutedUser.id);
    if (isTargetOwner) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot mute channel owner'
        }, HttpStatus.BAD_REQUEST);
    }
    const isTargetAdmin = channel.admins.some((admin) => admin.id === mutedUser.id);
    if (isTargetAdmin) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot mute another admin'
        }, HttpStatus.BAD_REQUEST);
    }
    return this.prisma.mute.create({
      data: {
        userId: user.id,
        channelId: channelId,
        mutedId: mutedUser.id,
      },
    });
  }  

  async removeMuteUser(userName: string, mutedUserName: string, channelId: number) {
    const user = await this.prisma.user.findUnique({ where: { name: userName } });
    const mutedUser = await this.prisma.user.findUnique({ where: { name: mutedUserName } });
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { admins: true, owners: true },
    });
    console.log("channel.admins", channel.admins);
    console.log("channel.owners", channel.owners);
    console.log("user", user);
    if (!user || !mutedUser || !channel) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User or channel not found'
        }, HttpStatus.BAD_REQUEST);
    }
    const isAdmin = channel.admins.some((admin) => admin.id === user.id);
    const isOwner = channel.owners.some((owner) => owner.id === user.id);
    if (!isAdmin && !isOwner) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Only channel admin or owner can remove mute'
        }, HttpStatus.BAD_REQUEST);  
    }
    const muteExists = await this.prisma.mute.findUnique({
      where: {
        userId_channelId_mutedId: {
          userId: user.id,
          channelId: channelId,
          mutedId: mutedUser.id,
        },
      },
    });
  
    if (!muteExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Mute not found'
        }, HttpStatus.BAD_REQUEST);
    }
    return this.prisma.mute.delete({
      where: {
        userId_channelId_mutedId: {
          userId: user.id,
          channelId: channelId,
          mutedId: mutedUser.id,
        },
      },
    });
  }
  
}
