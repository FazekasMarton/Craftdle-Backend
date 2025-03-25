import { Test, TestingModule } from '@nestjs/testing';
import { RiddlesService } from './riddles.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RiddlesService', () => {
  let service: RiddlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiddlesService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
      ],
    }).compile();

    service = module.get<RiddlesService>(RiddlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
