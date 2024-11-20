import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function roomTypes() {
    const existingRoomTypes = await prisma.roomType.findMany();

    if (existingRoomTypes.length > 0) {
        return;
    }

    await prisma.roomType.createMany({
        data: [
            {
                id: 1,
                description: 'Junior Suite',
                basePrice: 60,
            },
            {
                id: 2,
                description: 'King Suite',
                basePrice: 90,
            },
            {
                id: 3,
                description: 'Presidential Suite',
                basePrice: 150,
            },
        ],
    });
}
