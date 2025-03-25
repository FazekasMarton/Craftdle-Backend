import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service';
import { TokenService } from '../token/token.service';
import { SettingsService } from '../settings/settings.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
        {
          provide: AssetsService,
          useValue: {}, // Mock AssetsService
        },
        {
          provide: TokenService,
          useValue: {}, // Mock TokenService
        },
        {
          provide: SettingsService,
          useValue: {}, // Mock SettingsService
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
