import { Module } from "@nestjs/common";
import { Auth42Service } from "./auth42.service";
@Module({
  providers: [Auth42Service],
  exports: [Auth42Service],
})
export class Auth42Module {}
