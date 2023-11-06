import { Controller, Get, Post, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add/:adminUserName/:newAdminUserName')
  async addNewAdminUser(
    @Body('channelId') channelId: number,
    @Param('adminUserName') adminUserName: string,
    @Param('newAdminUserName') newAdminUserName: string)
  {   
    console.log("adminUserName: ", adminUserName);
    console.log("newAdminUserName: ", newAdminUserName);
    console.log("body: ", channelId);
    return await this.adminService.addNewAdminUser(adminUserName, newAdminUserName, channelId);
  }
}