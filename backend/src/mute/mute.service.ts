import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MuteCreateInput } from 'prisma/prisma-client';

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

  async addMuteUser(username: string, mutedUsername: string, channelId: number) {
    const user = await this.prisma.user.findUnique({ where: { name: username } });
    const mutedUser = await this.prisma.user.findUnique({ where: { name: mutedUsername } });
  
    if (!user || !mutedUser) {
      return null;
    }
  
    const data: MuteCreateInput = {  // 型を明示的に指定
      userId: user.id,
      channelId: channelId,
      muted: {
        connect: { id: mutedUser.id },
      },
    };
  
    return this.prisma.mute.create({ data });
  }
  

  async removeMuteUser(username: string, channelId: number) {
    const user = await this.prisma.user.findUnique({ where: { name: username } });

    if (!user) {
      return null;
    }

    return this.prisma.mute.delete({
      where: {
        userId_channelId: {
          userId: user.id,
          channelId: channelId,
        },
      },
    });
  }
}
