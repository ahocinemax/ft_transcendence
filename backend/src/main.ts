import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';

//config();
const oneWeek = 1000 * 60 * 60 * 24 * 7;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(session({
    secret: 'pass',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneWeek}
  }));
  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['content-type','Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    //preflightContinue: true,
    //optionsSuccessStatus: 204,
    credentials: true,
  });
  //app.use((req, res, next) => {
  //  console.log(req.method, req.headers);
  //  next();
  //});
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(4000);
}
bootstrap();
