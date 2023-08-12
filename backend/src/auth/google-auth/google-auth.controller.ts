import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly GoogleAuthService: GoogleAuthService) {}

}
