import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NUMBER_OF_ROOMS = 20;

export default async function rooms() {
    const existingRooms = await prisma.room.findMany();

    if (existingRooms.length > 0) {
        return;
    }

    const roomTypes = await prisma.roomType.findMany({
        select: { id: true },
    });

    for (let index = 0; index <= NUMBER_OF_ROOMS; index += 1) {
        const randomRoomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
        const maxGuests = Math.floor(Math.random() * 4) + 1;
        let bedCount = 1;

        if (maxGuests === 2) {
            bedCount = Math.random() >= 0.5 ? 1 : 2;
        } else if (maxGuests === 3) {
            bedCount = Math.random() >= 0.5 ? 2 : 3;
        } else if (maxGuests > 3) {
            bedCount = 3;
        }

        // eslint-disable-next-line no-await-in-loop
        await prisma.room.create({
            data: {
                roomTypeId: randomRoomType.id,
                roomNumber: index + 1,
                floor: Math.floor(Math.random() * 5) + 1,
                maxGuests,
                bedCount,
                oceanView: Math.random() >= 0.5,
            },
        });
    }
}
