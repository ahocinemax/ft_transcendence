import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
config();
const oneWeek = 1000 * 60 * 60 * 24 * 7;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    allowedHeaders: ['content-type'],
    methods: 'GET, HEAD, PATCH, POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: 'pass',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: oneWeek}
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  // //for test environement = NODE_ENV === development
  // if (process.env.NODE_ENV === 'development') {
  //   app.use(express.json({ limit: '50mb' }));
  //   app.use(express.urlencoded({ limit: '50mb', extended: true }));
  //   console.log('NODE_ENV:', process.env.NODE_ENV);
    // app.setBaseViewsDir('/usr/src/app/views');
    // app.setViewEngine('ejs');
    // app.useStaticAssets(join(__dirname, '..', '..', 'views'));
  // }
  await app.listen(4000);
}
bootstrap();
