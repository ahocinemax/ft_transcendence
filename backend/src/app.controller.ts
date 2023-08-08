import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //  @Get()
//  getHello(): string {
//    return this.appService.getHello();
//  }

  @Get()
  @Render('index.ejs')
  root() {
    return {
      API42_ID: process.env.API42_ID, 
      API42_URI: process.env.API42_URI 
    };
  }
}

