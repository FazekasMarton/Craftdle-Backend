import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';
import { RiddleModule } from './riddle/riddle.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [UsersModule, GameModule, SharedModule, RiddleModule, AssetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
