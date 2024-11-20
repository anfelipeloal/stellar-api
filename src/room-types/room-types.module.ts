import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomTypesService } from './room-types.service';
import { RoomTypesController } from './room-types.controller';

@Module({
    controllers: [RoomTypesController],
    providers: [PrismaService, RoomTypesService],
})
export class RoomTypesModule {}
