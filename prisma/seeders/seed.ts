/* eslint-disable import/extensions */
import { PrismaClient } from '@prisma/client';
import roomTypes from './roomTypes';
import rooms from './rooms';

const prisma = new PrismaClient();
async function main() {
    await roomTypes();
    await rooms();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
