import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  //for test environement = NODE_ENV === development
  if (process.env.NODE_ENV === 'development') {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  app.setBaseViewsDir('/usr/src/app/views');
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', '..', 'views'));
}

  await app.listen(4000);
}
bootstrap();
