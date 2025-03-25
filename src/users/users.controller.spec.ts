import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailService } from '../email/email.service';
import { EmailGateway } from '../email/email.gateway';
import { SettingsService } from '../settings/settings.service';
import { AssetsService } from '../assets/assets.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService
        },
        {
          provide: EmailService,
          useValue: {}, // Mock EmailService
        },
        {
          provide: EmailGateway,
          useValue: {}, // Mock EmailGateway
        },
        {
          provide: SettingsService,
          useValue: {}, // Mock SettingsService
        },
        {
          provide: AssetsService,
          useValue: {}, // Mock AssetsService
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
