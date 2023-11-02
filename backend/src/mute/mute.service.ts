import { Injectable } from '@nestjs/common';
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
  
    if (!user || !mutedUser) {
      return null;
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

    if (!user || !mutedUser) {
      return null;
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
