import {
    ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { Reservation } from '@prisma/client';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationAvailabilityParam } from './interfaces/reservation-availability-param.interface';
import { FindAllResponse } from './interfaces/find-all-response.interface';

@Injectable()
export class ReservationsService {
    constructor(
        private pricingService: PricingService,
        private prismaService: PrismaService,
        private roomService: RoomsService,
    ) {}

    async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
        const room = await this.roomService.findOne(createReservationDto.roomId);

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (createReservationDto.guests > room.maxGuests) {
            throw new ConflictException('Guests exceed room capacity');
        }

        const isRoomBusy = await this.checkReservationAvailability(createReservationDto);

        if (isRoomBusy) {
            throw new ConflictException('Room is not available for requested dates');
        }

        const reservationDays = this.pricingService.daysBetweenDates(createReservationDto.checkInDate, createReservationDto.checkOutDate);
        const weekendDays = this.pricingService.weekendDaysBetweenDates(createReservationDto.checkInDate, createReservationDto.checkOutDate);

        const totals = this.pricingService.calculateTotals(
            room.roomType.basePrice,
            createReservationDto.guests,
            createReservationDto.breakfast,
            reservationDays,
            weekendDays,
        );

        return this.prismaService.reservation.create({
            data: {
                roomId: createReservationDto.roomId,
                guestName: createReservationDto.guestName,
                checkInDate: createReservationDto.checkInDate,
                checkOutDate: createReservationDto.checkOutDate,
                guests: createReservationDto.guests,
                breakfast: createReservationDto.breakfast,
                baseCharge: totals.baseCharge,
                weekendsCharge: totals.weekendsCharge,
                breakfastCharge: totals.breakfastCharge,
                discountByDays: totals.discountByDays,
                total: totals.total,
            },
        });
    }

    async checkReservationAvailability(data: ReservationAvailabilityParam): Promise<Reservation> {
        return this.prismaService.reservation.findFirst({
            where: {
                roomId: data.roomId,
                OR: [
                    {
                        AND: [
                            {
                                checkInDate: {
                                    gte: data.checkInDate,
                                },
                            },
                            {
                                checkInDate: {
                                    lt: data.checkOutDate,
                                },
                            },
                            {
                                cancelled: false,
                            },
                        ],
                    },
                    {
                        AND: [
                            {
                                checkOutDate: {
                                    gt: data.checkInDate,
                                },
                            },
                            {
                                checkOutDate: {
                                    lte: data.checkOutDate,
                                },
                            },
                            {
                                cancelled: false,
                            },
                        ],
                    },
                ],
            },
        });
    }

    async findAll(): Promise<FindAllResponse> {
        const cancelled = await this.cancelledReservations();
        const past = await this.pastReservations();
        const future = await this.futureReservations();
        const ongoing = await this.ongoingReservations();

        return {
            cancelled,
            past,
            future,
            ongoing,
        };
    }

    async findOne(id: number): Promise<Reservation> {
        const reservation = await this.prismaService.reservation.findUnique({
            where: {
                id,
            },
            include: {
                room: {
                    include: {
                        roomType: true,
                    },
                },
            },
        });

        if (!reservation) {
            throw new NotFoundException(`Reservation ${id} not found`);
        }

        return reservation;
    }

    async cancel(id: number): Promise<string> {
        await this.prismaService.reservation.update({
            where: {
                id,
            },
            data: {
                cancelled: true,
                cancelledAt: new Date(),
            },
        });

        return `Reservation ${id} cancelled`;
    }

    async cancelledReservations(): Promise<Reservation[]> {
        return this.prismaService.reservation.findMany({
            where: {
                cancelled: true,
            },
            include: {
                room: {
                    include: {
                        roomType: true,
                    },
                },
            },
        });
    }

    async pastReservations(): Promise<Reservation[]> {
        return this.prismaService.reservation.findMany({
            where: {
                cancelled: false,
                checkOutDate: {
                    lt: new Date(),
                },
            },
            include: {
                room: {
                    include: {
                        roomType: true,
                    },
                },
            },
        });
    }

    async futureReservations(): Promise<Reservation[]> {
        return this.prismaService.reservation.findMany({
            where: {
                cancelled: false,
                checkInDate: {
                    gt: new Date().toISOString(),
                },
            },
            include: {
                room: {
                    include: {
                        roomType: true,
                    },
                },
            },
        });
    }

    async ongoingReservations(): Promise<Reservation[]> {
        return this.prismaService.reservation.findMany({
            where: {
                cancelled: false,
                checkInDate: {
                    lte: new Date(),
                },
                checkOutDate: {
                    gte: new Date(),
                },
            },
            include: {
                room: {
                    include: {
                        roomType: true,
                    },
                },
            },
        });
    }
}
