import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  @Render('index.ejs')
  root() {
    return {
      API42_ID: process.env.API42_ID, 
      API42_URI: process.env.API42_URI 
    };
  }
}
