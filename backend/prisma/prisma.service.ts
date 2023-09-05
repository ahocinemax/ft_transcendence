import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient
{
  [x: string]: any;
  private _msg: any;
  public get msg() : any {
    return this._msg;
  }
  public set msg(v : any) {
    this._msg = v;
  }
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
