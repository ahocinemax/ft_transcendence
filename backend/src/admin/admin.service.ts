import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async addNewAdminUser(adminUserName: string, newAdminUserName: string, channelId: number){
    const user = await this.prisma.user.findUnique({ where: { name: adminUserName } });
    const newAdminUser = await this.prisma.user.findUnique({ where: { name: newAdminUserName } });
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { admins: true, owners: true},
    });
    if (!user || !newAdminUser || !channel) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User or channel not found'
        }, HttpStatus.BAD_REQUEST);
    }
    const isOwner = channel.owners.some((owner) => owner.id === user.id);
    if (!isOwner) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Only channel owner can add new admins'
        }, HttpStatus.BAD_REQUEST);
    }
    const isTargetAdmin = channel.admins.some((admin) => admin.id === newAdminUser.id);
    if (isTargetAdmin) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User is already an admin'
        }, HttpStatus.BAD_REQUEST);
    }
    return this.prisma.channel.update({
      where: { id: channelId },
      data: {
        admins: {
          connect: { id: newAdminUser.id }
        }
      }
    });
  }

}