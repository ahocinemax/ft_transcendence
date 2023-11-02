import { Controller, Get, Post, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { MuteService } from './mute.service';

@Controller('mute')
export class MuteController {
  constructor(private readonly muteService: MuteService) {}

  @Get(':username')
  async getMuteUser(@Param('username') username: string) {
    return await this.muteService.getMutedUser(username);
  }

  @Post('add/:userName/:muteUserName')
  async addMuteUser(
    @Body('channelId') channelId: number,
    @Param('userName') userName: string,
    @Param('muteUserName') muteUserName: string)
  {   
    console.log("userName: ", userName);
    console.log("muteUserName: ", muteUserName);
    console.log("body: ", channelId);
    return await this.muteService.addMuteUser(userName, muteUserName, channelId);
  }

  @Delete('remove/:userName/:mutedUserName')
  async removeMuteUser(
    @Query('channelId', ParseIntPipe) channelId: number,
    @Param('userName') userName: string,
    @Param('mutedUserName') mutedUserName: string
  ) {
    return await this.muteService.removeMuteUser(userName, mutedUserName, channelId);
  }
}
