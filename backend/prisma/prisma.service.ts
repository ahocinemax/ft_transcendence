import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
        await this.$connect();
    } catch (e) {
        console.log('ERROR');
        console.log(e);
    }
}
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
