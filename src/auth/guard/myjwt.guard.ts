import { AuthGuard } from '@nestjs/passport';

export class MyJwTGuard extends AuthGuard('jwt') {}
