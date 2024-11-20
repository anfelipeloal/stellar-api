import { Room, RoomType } from '@prisma/client';

export interface FindOneResponse extends Room {
    roomType: RoomType;
}
