import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { HttpException } from '@nestjs/common';

const mockPrismaService = {
    settings: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
    },
    controls: {
        update: jest.fn(),
    },
    table_mappings: {
        updateMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
};

const mockTokenService = {
    validateBearerToken: jest.fn(),
};

describe('SettingsService', () => {
    let service: SettingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SettingsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: TokenService, useValue: mockTokenService },
            ],
        }).compile();

        service = module.get<SettingsService>(SettingsService);
    });

    describe('collectSettings', () => {
        it('should return user settings', async () => {
            mockTokenService.validateBearerToken.mockResolvedValue(1);
            mockPrismaService.settings.findMany.mockResolvedValue([{ id: 1, volume: 50, image_size: 50, is_set: true }]);

            const result = await service.collectSettings('Bearer token');
            expect(result).toEqual([{ id: 1, volume: 50, imagesSize: 50, isSet: true, controls: expect.any(Object) }]);
        });

        it('should throw an HttpException if token validation fails', async () => {
            mockTokenService.validateBearerToken.mockRejectedValue(new Error('Invalid token'));

            await expect(service.collectSettings('Bearer token')).rejects.toThrow(HttpException);
        });
    });

    describe('gatherSettings', () => {
        it('should throw an error if no settings are found', async () => {
            mockPrismaService.settings.findMany.mockResolvedValue([]);

            await expect(service.gatherSettings(1)).rejects.toThrow('Settings not found for this user.');
        });
    });
});