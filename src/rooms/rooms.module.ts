import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
    controllers: [RoomsController],
    providers: [PricingService, PrismaService, RoomsService],
})
export class RoomsModule {}
