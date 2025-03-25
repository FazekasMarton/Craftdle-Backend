import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { CreateMaintenanceDto } from "./dto/createMaintenance.dto";
import { getCurrentDate } from "src/sharedComponents/utilities/date.util";

@Injectable()
export class MaintenanceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsersService,
    ) { }

    async createMaintenance(createMaintenanceDto: CreateMaintenanceDto, authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');

            const user = await this.usersService.getUserByToken(token);

            if (!user?.adminRights?.modifyMaintenance) {
                throw new Error('You do not have permission to modify maintenance');
            }

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            return await this.prisma.maintenance.create({
                data: {
                    user: user.id,
                    ...createMaintenanceDto
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getUpcomingMaintenance() {
        return this.prisma.maintenance.findFirst({
            where: {
                end: { gt: getCurrentDate() },
            },
            orderBy: {
                start: 'asc'
            },
        });
    }

    async getAllMaintenance(authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');
            const user = await this.usersService.getUserByToken(token);
            // if (!user) {
            //     throw new Error('Invalid token');
            // }

            const maintenances = await this.prisma.maintenance.findMany({
                orderBy: {
                    start: 'asc'
                },
                include: {
                    
                }
            });

            return maintenances.map(maintenance => {
                return {
                    ...maintenance,
                    active: maintenance.end > getCurrentDate()
                };
            })
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getCurrentMaintenance() {
        const upcomingMaintenance = await this.getUpcomingMaintenance();
        if (!upcomingMaintenance) {
            return {
                started: false,
                countdown: null
            };
        }

        const now = getCurrentDate();

        const started = upcomingMaintenance.start < now;

        const countdown = Math.round((started ? (
            upcomingMaintenance.end.getTime() - now.getTime()
        ) : (
            upcomingMaintenance.start.getTime() - now.getTime()
        )) / 1000);

        return {
            started: started,
            countdown: countdown > 0 ? countdown : null
        };
    }

    async updateMaintenance(id: string, createMaintenanceDto: CreateMaintenanceDto, authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');

            const user = await this.usersService.getUserByToken(token);

            if (!user?.adminRights?.modifyMaintenance) {
                throw new Error('You do not have permission to modify maintenance');
            }

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            return await this.prisma.maintenance.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    user: user.id,
                    ...createMaintenanceDto
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteMaintenance(id: string, authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');

            const user = await this.usersService.getUserByToken(token);

            if (!user?.adminRights?.modifyMaintenance) {
                throw new Error('You do not have permission to modify maintenance');
            }

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            return await this.prisma.maintenance.delete({
                where: {
                    id: parseInt(id)
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }
}