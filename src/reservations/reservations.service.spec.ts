import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationsService', () => {
    let service: ReservationsService;
    let pricingService: PricingService;
    let prismaService: PrismaService;
    let roomsService: RoomsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationsService,
                {
                    provide: PricingService,
                    useValue: {
                        daysBetweenDates: jest.fn(),
                        weekendDaysBetweenDates: jest.fn(),
                        calculateTotals: jest.fn(),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        reservation: {
                            create: jest.fn(),
                            findFirst: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            findMany: jest.fn(),
                        },
                    },
                },
                {
                    provide: RoomsService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ReservationsService>(ReservationsService);
        pricingService = module.get<PricingService>(PricingService);
        prismaService = module.get<PrismaService>(PrismaService);
        roomsService = module.get<RoomsService>(RoomsService);
    });

    describe('create', () => {
        it('should throw NotFoundException if room is not found', async () => {
            roomsService.findOne = jest.fn().mockResolvedValue(null);

            const createReservationDto: CreateReservationDto = {
                roomId: 1,
                guestName: 'John Doe',
                checkInDate: new Date(),
                checkOutDate: new Date(),
                guests: 2,
                breakfast: true,
            };

            await expect(service.create(createReservationDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException if guests exceed room capacity', async () => {
            roomsService.findOne = jest.fn().mockResolvedValue({ maxGuests: 2 });

            const createReservationDto: CreateReservationDto = {
                roomId: 1,
                guestName: 'John Doe',
                checkInDate: new Date(),
                checkOutDate: new Date(),
                guests: 3,
                breakfast: true,
            };

            await expect(service.create(createReservationDto)).rejects.toThrow(ConflictException);
        });

        it('should throw ConflictException if room is not available for requested dates', async () => {
            roomsService.findOne = jest.fn().mockResolvedValue({ maxGuests: 2 });
            service.checkReservationAvailability = jest.fn().mockResolvedValue({ id: 1 });

            const createReservationDto: CreateReservationDto = {
                roomId: 1,
                guestName: 'John Doe',
                checkInDate: new Date(),
                checkOutDate: new Date(),
                guests: 2,
                breakfast: true,
            };

            await expect(service.create(createReservationDto)).rejects.toThrow(ConflictException);
        });

        it('should create a reservation successfully', async () => {
            roomsService.findOne = jest.fn().mockResolvedValue({ maxGuests: 2, roomType: { basePrice: 90 } });
            service.checkReservationAvailability = jest.fn().mockResolvedValue(null);
            pricingService.daysBetweenDates = jest.fn().mockReturnValue(2);
            pricingService.weekendDaysBetweenDates = jest.fn().mockReturnValue(1);
            pricingService.calculateTotals = jest.fn().mockReturnValue({
                baseCharge: 270,
                weekendsCharge: 22.5,
                breakfastCharge: 0,
                discountByDays: 0,
                total: 292.5,
            });
            const mockReservation = {
                id: 12,
                roomId: 7,
                guestName: 'John Doe',
                checkInDate: '2024-11-17T00:00:00.000Z',
                checkOutDate: '2024-11-20T00:00:00.000Z',
                guests: 1,
                breakfast: false,
                baseCharge: 270,
                weekendsCharge: 22.5,
                breakfastCharge: 0,
                discountByDays: 0,
                total: 292.5,
                cancelled: false,
                createdAt: '2024-11-19T23:22:44.813Z',
                cancelledAt: null,
            };

            prismaService.reservation.create = jest.fn().mockResolvedValue(mockReservation);

            const createReservationDto: CreateReservationDto = {
                roomId: 7,
                guestName: 'John Doe',
                checkInDate: new Date('2024-11-17'),
                checkOutDate: new Date('2024-11-20'),
                guests: 1,
                breakfast: true,
            };

            const result = await service.create(createReservationDto);
            expect(result).toEqual(mockReservation);
        });
    });

    describe('checkReservationAvailability', () => {
        it('should return a reservation if room is busy', async () => {
            const reservation = { id: 1 };
            prismaService.reservation.findFirst = jest.fn().mockResolvedValue(reservation);

            const result = await service.checkReservationAvailability({ roomId: 1, checkInDate: new Date(), checkOutDate: new Date() });
            expect(result).toEqual(reservation);
        });

        it('should return null if room is available', async () => {
            prismaService.reservation.findFirst = jest.fn().mockResolvedValue(null);

            const result = await service.checkReservationAvailability({ roomId: 1, checkInDate: new Date(), checkOutDate: new Date() });
            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return all reservations', async () => {
            const cancelled = [{ id: 1 }];
            const past = [{ id: 2 }];
            const future = [{ id: 3 }];
            const ongoing = [{ id: 4 }];

            service.cancelledReservations = jest.fn().mockResolvedValue(cancelled);
            service.pastReservations = jest.fn().mockResolvedValue(past);
            service.futureReservations = jest.fn().mockResolvedValue(future);
            service.ongoingReservations = jest.fn().mockResolvedValue(ongoing);

            const result = await service.findAll();
            expect(result).toEqual({
                cancelled, past, future, ongoing,
            });
        });
    });

    describe('findOne', () => {
        it('should throw NotFoundException if reservation is not found', async () => {
            prismaService.reservation.findUnique = jest.fn().mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });

        it('should return a reservation if found', async () => {
            const reservation = { id: 1 };
            prismaService.reservation.findUnique = jest.fn().mockResolvedValue(reservation);

            const result = await service.findOne(1);
            expect(result).toEqual(reservation);
        });
    });

    describe('cancel', () => {
        it('should cancel a reservation successfully', async () => {
            prismaService.reservation.update = jest.fn().mockResolvedValue({ id: 1 });

            const result = await service.cancel(1);
            expect(result).toEqual('Reservation 1 cancelled');
        });
    });

    describe('cancelledReservations', () => {
        it('should return cancelled reservations', async () => {
            const reservations = [{ id: 1 }];
            prismaService.reservation.findMany = jest.fn().mockResolvedValue(reservations);

            const result = await service.cancelledReservations();
            expect(result).toEqual(reservations);
        });
    });

    describe('pastReservations', () => {
        it('should return past reservations', async () => {
            const reservations = [{ id: 1 }];
            prismaService.reservation.findMany = jest.fn().mockResolvedValue(reservations);

            const result = await service.pastReservations();
            expect(result).toEqual(reservations);
        });
    });

    describe('futureReservations', () => {
        it('should return future reservations', async () => {
            const reservations = [{ id: 1 }];
            prismaService.reservation.findMany = jest.fn().mockResolvedValue(reservations);

            const result = await service.futureReservations();
            expect(result).toEqual(reservations);
        });
    });

    describe('ongoingReservations', () => {
        it('should return ongoing reservations', async () => {
            const reservations = [{ id: 1 }];
            prismaService.reservation.findMany = jest.fn().mockResolvedValue(reservations);

            const result = await service.ongoingReservations();
            expect(result).toEqual(reservations);
        });
    });
});
