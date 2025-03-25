import { Test, TestingModule } from '@nestjs/testing';
import { SocketGateway } from './socket.gateway';
import { AchievementsGateway } from '../achievements/achievements.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { RecipesService } from '../recipes/recipes.service';
import { GameService } from '../game/game.service';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { Maintenance } from 'src/admin/classes/Maintenance';

describe('SocketGateway', () => {
  let gateway: SocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocketGateway,
        {
          provide: Maintenance,
          useValue: {}, // Mock Maintenance
        },
        {
          provide: AchievementsGateway,
          useValue: {}, // Mock AchievementsGateway
        },
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
        {
          provide: CacheService,
          useValue: {}, // Mock CacheService
        },
        {
          provide: RecipesService,
          useValue: {}, // Mock RecipesService
        },
        {
          provide: GameService,
          useValue: {}, // Mock GameService
        },
        {
          provide: TokenService,
          useValue: {}, // Mock TokenService
        },
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService
        },
      ],
    }).compile();

    gateway = module.get<SocketGateway>(SocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
