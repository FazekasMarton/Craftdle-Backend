import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import { RecipesService } from '../recipes/recipes.service'; // Import RecipesService

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
        {
          provide: RecipesService,
          useValue: {}, // Mock RecipesService
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
