import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fetchGameModesWithLastUnsolvedGame } from './utilities/gamemode.util';
import { IGamemode } from './interfaces/gamemode.interface';
import tokenValidation from '../shared/utilities/tokenValidation.util';

@Injectable()
export class GameService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getGameModesWithLastUnsolvedGame(authorization: string): Promise<IGamemode[]> {
        try {
            const user = await tokenValidation.validateBearerToken(authorization, this.prisma);
            if(user){
                throw new UnauthorizedException('Authorization header is required');
            }
            return await fetchGameModesWithLastUnsolvedGame(this.prisma, user.id);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }
}