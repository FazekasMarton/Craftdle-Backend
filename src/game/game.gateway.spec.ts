import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { CacheService } from '../cache/cache.service';
import { RecipesService } from '../recipes/recipes.service';
import { GameService } from '../game/game.service';
import { TipService } from '../tip/tip.service';
import { AchievementsGateway } from '../achievements/achievements.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service';
import { RiddlesService } from '../riddles/riddles.service';
import { UsersService } from '../users/users.service';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
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
          provide: TipService,
          useValue: {}, // Mock TipService
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
          provide: AssetsService,
          useValue: {}, // Mock AssetsService
        },
        {
          provide: RiddlesService,
          useValue: {}, // Mock RiddlesService
        },
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService
        },
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});