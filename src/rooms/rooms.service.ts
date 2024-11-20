import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { FindAvailableRoomsDto } from './dto/find-available-rooms.dto';
import { FindOneResponse } from './interfaces/find-one-response.interface';
import { FindAvailableRoomsResponse } from './interfaces/find-available-rooms-response.interface';

@Injectable()
export class RoomsService {
    constructor(
        private pricingService: PricingService,
        private prismaService: PrismaService,
    ) {}

    async findAvailableRooms(data: FindAvailableRoomsDto): Promise<FindAvailableRoomsResponse[]> {
        const reservationDays = this.pricingService.daysBetweenDates(data.checkInDate, data.checkOutDate);
        const weekendDays = this.pricingService.weekendDaysBetweenDates(data.checkInDate, data.checkOutDate);

        const availableRooms = await this.prismaService.room.findMany({
            select: {
                id: true,
                maxGuests: true,
                bedCount: true,
                oceanView: true,
                roomTypeId: true,
                roomNumber: true,
                floor: true,
                roomType: {
                    select: {
                        id: true,
                        description: true,
                        basePrice: true,
                    },
                },
            },
            where: {
                maxGuests: {
                    gte: data.guests,
                },
                reservations: {
                    none: {
                        AND: [
                            {
                                checkInDate: {
                                    lt: data.checkOutDate,
                                },
                            },
                            {
                                checkOutDate: {
                                    gt: data.checkInDate,
                                },
                            },
                            {
                                cancelled: false,
                            },
                        ],
                    },
                },
                ...data.roomTypeId && { roomTypeId: data.roomTypeId },
            },
        });

        return availableRooms.map((room) => {
            const totals = this.pricingService.calculateTotals(
                room.roomType.basePrice,
                data.guests,
                data.breakfast,
                reservationDays,
                weekendDays,
            );

            return {
                ...room,
                total: totals.total,
                totalBreakdown: {
                    ...totals,
                },
            };
        });
    }

    async findOne(id: number): Promise<FindOneResponse> {
        return this.prismaService.room.findUnique({
            where: {
                id,
            },
            include: {
                roomType: true,
            },
        });
    }
}
