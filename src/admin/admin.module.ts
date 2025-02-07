import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketModule } from 'src/socket/socket.module';
import { UsersModule } from 'src/users/users.module';
import { Maintenance } from './classes/Maintenance';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    SocketModule,
    UsersModule
  ],
  controllers: [AdminController],
  providers: [PrismaService, AdminService, Maintenance, EmailService],
  exports: [AdminService],
})
export class AdminModule {}
