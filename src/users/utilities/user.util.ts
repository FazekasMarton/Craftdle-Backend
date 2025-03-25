import { HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getCurrentDate } from "src/sharedComponents/utilities/date.util";

export async function getUserById(userId: number, prisma: PrismaService) {
    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            throw new HttpException(`User with ID ${userId} not found.`, HttpStatus.NOT_FOUND);
        }
        return user;
    } catch (error) {
        throw new HttpException("Failed to retrieve user data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getStreak(userId: number, prisma: PrismaService) {
    const playedDailyGames = await prisma.games.findMany({
        where: {
            player: userId,
            is_solved: true,
            gamemodes: {
                name: "Daily"
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    let streak = 0;
    let lastDate = new Date(playedDailyGames[0]?.date);
    lastDate.setHours(1, 0, 0, 0);

    const yesterday = getCurrentDate();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(1, 0, 0, 0);

    const playedDates = new Set<number>();
    const maintenanceDates = await getMaintenanceDates(prisma);

    playedDailyGames.forEach(game => {
        const date = new Date(game.date);
        date.setHours(1, 0, 0, 0);
        playedDates.add(date.getTime());
    });

    if (lastDate.getTime() >= yesterday.getTime() || maintenanceDates.has(yesterday.getTime())) {
        while (playedDates.has(lastDate.getTime()) || maintenanceDates.has(lastDate.getTime())) {
            if(playedDates.has(lastDate.getTime())){
                streak++;
                lastDate.setDate(lastDate.getDate() - 1);
            } else if(maintenanceDates.has(lastDate.getTime())){
                lastDate.setDate(lastDate.getDate() - 1);
            } else {
                break;
            }
        }
    }

    return streak;
}

async function getMaintenanceDates(prisma: PrismaService): Promise<Set<number>> {
    const maintenances = await prisma.maintenance.findMany();
    const dates = new Set<number>();

    maintenances.forEach(maintenance => {
        let date = new Date(maintenance.start);
        date.setHours(1, 0, 0, 0);

        while (date <= maintenance.end) {
            dates.add(date.getTime());
            date.setDate(date.getDate() + 1);
        }
    });

    return dates;
}