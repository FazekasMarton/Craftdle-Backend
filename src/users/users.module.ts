import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/shared/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService]
})
export class UsersModule {}
