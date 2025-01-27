import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { AssetsModule } from './assets/assets.module';
import { CacheModule } from './cache/cache.module';
import { AdminModule } from './admin/admin.module';
import { SocketModule } from './socket/socket.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    UsersModule,
    GameModule,
    CacheModule,
    AdminModule,
    SocketModule,
    AssetsModule,
    PrismaModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
