import { PrismaService } from '../../prisma/prisma.service';
import { IUser } from '../interfaces/IUserData';
import { createToken } from '../../shared/utilities/tokenCreation';
import * as bcrypt from 'bcrypt';
import { getCurrentDate } from 'src/shared/utilities/CurrentDate';

export async function createAccount(
    prisma: PrismaService,
    accountData?: { username?: string; email?: string; password?: string; stayLoggedIn?: boolean }
): Promise<IUser> {
    try {
        // Döntés: vendég vagy normál felhasználó
        const isGuest = !accountData || !accountData.username || !accountData.email || !accountData.password;

        let userData;

        if (isGuest) {
            // Vendég felhasználó adatai
            userData = { 
                is_guest: true,
                registration_date: getCurrentDate(),
            };
        } else {
            // Normál felhasználó adatai
            const hashedPassword = await bcrypt.hash(accountData.password, 2); // Jelszó hashelése
            userData = {
                username: accountData.username,
                email: accountData.email,
                password: hashedPassword,
                is_guest: false,
                registration_date: getCurrentDate(),
            };
        }

        // Felhasználó létrehozása
        const createdUser = await prisma.users.create({
            data: userData
        });

        // Törzsadatok generálása
        return {
            id: createdUser.id,
            loginToken: await createToken(prisma),
            username: isGuest ? `Guest${createdUser.id}` : createdUser.username,
            profilePicture: {
                id: 15,
                name: "Desert Villager Base",
                src: "Desert_Villager_Base.png"
            },
            isGuest: isGuest,
            profileBorder: {
                id: 7,
                name: "Grass",
                src: "Grass.png"
            },
            stayLoggedIn: isGuest ? false : !!accountData?.stayLoggedIn,
        };
    } catch (error) {
        console.error("Error creating account:", error);
        throw new Error("Failed to create account.");
    }
}