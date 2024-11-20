import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { RoomsService } from '../rooms/rooms.service';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';

@Module({
    controllers: [ReservationsController],
    providers: [PrismaService, PricingService, RoomsService, ReservationsService],
})
export class ReservationsModule {}
