import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() — barcha modulda import qilmasdan ishlatish mumkin bo'ladi
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}