import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', '..', 'test_page'));
  app.setViewEngine('ejs');
//  app.setBaseViewsDir(join(__dirname, '..', 'test_page'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'test_page'));

  await app.listen(4000);
}
bootstrap();
