import { Test, TestingModule } from '@nestjs/testing';
import { CliService } from './cli.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

describe('CliService', () => {
  let service: CliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CliService,
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

    service = module.get<CliService>(CliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
