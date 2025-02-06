import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDataDto } from 'src/users/dtos/LoginData.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private readonly usersService: UsersService,
    ) { }

    async login(loginDataDto: LoginDataDto) {
        try {
            const user = await this.usersService.handleBodyLogin({
                ...loginDataDto,
                stayLoggedIn: false
            });
            if (!('id' in user)) {
                throw new Error('User does not have an id property');
            }
            await this.usersService.getUserByToken(user.loginToken);
            return { user };
        } catch (err) {
            throw err;
        }
    }

    logout(authHeader: string) {
        try {
            return this.usersService.logoutUser(authHeader);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
