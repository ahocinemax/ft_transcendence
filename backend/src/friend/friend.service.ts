import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FriendService {
    constructor(private readonly prisma: PrismaService) {}

    async getFriend(name: string) {
        try {
            const friend = await this.prisma.user.findFirst({
                where: {
                    name: name,
                },
                include: {
                    friends: true, 
                },
            });
            return friend?.friends!;
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
}
