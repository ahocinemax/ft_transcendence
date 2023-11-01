import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { MuteService } from './mute.service';

@Controller('mute')
export class MuteController {
  constructor(private readonly muteService: MuteService) {}

  @Get(':username')
  async getMuteUser(@Param('username') username: string) {
    return await this.muteService.getMutedUser(username);
  }

  @Post('add')
  async addMuteUser(@Body() body) {
    return await this.muteService.addMuteUser(body.username, body.mutedUsername, body.channelId);
  }

  @Delete('remove')
  async removeMuteUser(@Body() body) {
    return await this.muteService.removeMuteUser(body.username, body.mutedUsername);
  }
}
