import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const sqlFilePath = path.join(__dirname, './seeder.sql'); // Cseréld ki a fájl útvonalát
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8'); // Fájl beolvasása

    console.log('Seeding adatbázis...');
    const queries = sqlContent.split(';');

    try {
        for (const query of queries) {
            if (query.trim()) {
                await prisma.$executeRawUnsafe(query);
            }
        }
        console.log('Seeding kész!');
    } catch (error) {
        console.error('Hiba történt a seeding során:', error);
    } finally {
        await prisma.$disconnect(); // Prisma kapcsolódás bontása
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
