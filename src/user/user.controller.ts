import { Controller, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { MyJwTGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  @Get('me')
  //   @UseGuards(AuthGuard('jwt'))
  @UseGuards(MyJwTGuard)
  getMe(@GetUser() user: Request) {
    return user;
  }
}
