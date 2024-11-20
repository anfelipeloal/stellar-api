import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { RoomTypesService } from './room-types.service';

describe('RoomTypesService', () => {
    let service: RoomTypesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomTypesService,
                {
                    provide: PrismaService,
                    useValue: {
                        roomType: {
                            findMany: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<RoomTypesService>(RoomTypesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('findAll', () => {
        it('should return an array of room types', async () => {
            const mockRoomTypes = [
                {
                    id: 1,
                    description: 'Mock Room 1',
                    basePrice: 100,
                },
                {
                    id: 2,
                    description: 'Mock Room 2',
                    basePrice: 200,
                },
            ];

            prismaService.roomType.findMany = jest.fn().mockResolvedValue(mockRoomTypes);

            const result = await service.findAll();

            expect(result).toBe(mockRoomTypes);
        });
    });
});
