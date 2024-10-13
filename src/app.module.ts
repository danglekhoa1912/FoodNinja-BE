import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
