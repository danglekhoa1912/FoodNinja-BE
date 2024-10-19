import { Controller, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MyJwTGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('user')
export class UserController {
  @Get('me')
  //   @UseGuards(AuthGuard('jwt'))
  @UseGuards(MyJwTGuard)
  getMe(@GetUser() user: Request) {
    return user;
  }
}
