import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
