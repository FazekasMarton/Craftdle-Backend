import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SocketModule } from 'src/socket/socket.module';
import { UsersModule } from 'src/users/users.module';
import { Maintenance } from './classes/Maintenance';
import { AssetsModule } from 'src/assets/assets.module';
import { GameModule } from 'src/game/game.module';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    SocketModule,
    UsersModule,
    AssetsModule,
    GameModule,
    EmailModule,
    AdminModule,
    PrismaModule
  ],
  controllers: [AdminController],
  providers: [AdminService, Maintenance],
  exports: [AdminService],
})
export class AdminModule {}
