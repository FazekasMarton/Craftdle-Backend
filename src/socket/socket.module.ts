import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '../cache/cache.module';
import { GameModule } from '../game/game.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesModule } from 'src/recipes/recipes.module';
import { TokenModule } from 'src/token/token.module';
import { MaintenanceModule } from 'src/maintenance/maintenance.module';

@Module({
    imports: [
        UsersModule,
        CacheModule,
        GameModule,
        AchievementsModule,
        PrismaModule,
        CacheModule,
        RecipesModule,
        TokenModule,
        MaintenanceModule
    ],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule { }