import { Injectable } from '@nestjs/common';
import { RoomType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomTypesService {
    constructor(
        private prismaService: PrismaService,
    ) {}

    async findAll(): Promise<RoomType[]> {
        return this.prismaService.roomType.findMany();
    }
}
