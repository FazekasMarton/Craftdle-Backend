import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SocketGateway } from '../socket/socket.gateway';
import { EmailService } from '../email/email.service';
import { StatisticsService } from '../statistics/statistics.service';
import { CliService } from '../cli/cli.service';
import { Maintenance } from './classes/Maintenance';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {}, // Mock AdminService
        },
        {
          provide: Maintenance,
          useValue: {}, // Mock Maintenance
        },
        {
          provide: SocketGateway,
          useValue: {}, // Mock SocketGateway
        },
        {
          provide: EmailService,
          useValue: {}, // Mock EmailService
        },
        {
          provide: StatisticsService,
          useValue: {}, // Mock StatisticsService
        },
        {
          provide: CliService,
          useValue: {}, // Mock CliService
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
