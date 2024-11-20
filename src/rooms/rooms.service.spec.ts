import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { FindAvailableRoomsDto } from './dto/find-available-rooms.dto';

describe('RoomsService', () => {
    let service: RoomsService;
    let pricingService: PricingService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomsService,
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
                        room: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<RoomsService>(RoomsService);
        pricingService = module.get<PricingService>(PricingService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('findAvailableRooms', () => {
        it('should return available rooms with calculated totals', async () => {
            const data: FindAvailableRoomsDto = {
                checkInDate: new Date(),
                checkOutDate: new Date(),
                guests: 2,
                breakfast: true,
                roomTypeId: 1,
            };

            const mockRooms = [
                {
                    id: 1,
                    maxGuests: 2,
                    bedCount: 1,
                    oceanView: true,
                    roomTypeId: 1,
                    roomNumber: '101',
                    floor: 1,
                    roomType: {
                        id: 1,
                        description: 'Deluxe Room',
                        basePrice: 100,
                    },
                },
            ];

            const mockTotals = {
                total: 200,
                basePrice: 100,
                breakfast: 20,
                guests: 2,
                reservationDays: 2,
                weekendDays: 1,
            };

            pricingService.daysBetweenDates = jest.fn().mockReturnValue(2);
            pricingService.weekendDaysBetweenDates = jest.fn().mockReturnValue(1);
            prismaService.room.findMany = jest.fn().mockResolvedValue(mockRooms);
            pricingService.calculateTotals = jest.fn().mockReturnValue(mockTotals);

            const result = await service.findAvailableRooms(data);

            expect(result).toEqual([
                {
                    ...mockRooms[0],
                    total: mockTotals.total,
                    totalBreakdown: {
                        ...mockTotals,
                    },
                },
            ]);
        });
    });

    describe('findOne', () => {
        it('should return a room by id', async () => {
            const mockRoom = {
                id: 1,
                maxGuests: 2,
                bedCount: 1,
                oceanView: true,
                roomTypeId: 1,
                roomNumber: '101',
                floor: 1,
                roomType: {
                    id: 1,
                    description: 'Deluxe Room',
                    basePrice: 100,
                },
            };

            prismaService.room.findUnique = jest.fn().mockResolvedValue(mockRoom);

            const result = await service.findOne(1);

            expect(result).toEqual(mockRoom);
        });
    });
});
