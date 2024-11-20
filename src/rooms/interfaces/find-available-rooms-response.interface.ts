import { Room, RoomType } from '@prisma/client';
import { CalculateTotalsResponse } from '../../pricing/interfaces/calculate-totals-response.interface';

export interface FindAvailableRoomsResponse extends Room {
    roomType: RoomType;
    total: number;
    totalBreakdown: CalculateTotalsResponse;
}
