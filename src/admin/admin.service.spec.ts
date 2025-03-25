import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import { UsersService } from '../users/users.service';
import { GameService } from '../game/game.service';
import { AssetsService } from '../assets/assets.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService
        },
        {
          provide: GameService,
          useValue: {}, // Mock GameService
        },
        {
          provide: AssetsService,
          useValue: {}, // Mock AssetsService
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
