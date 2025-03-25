import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
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

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
