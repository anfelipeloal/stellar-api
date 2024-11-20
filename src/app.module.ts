import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
    imports: [RoomsModule, RoomTypesModule, ReservationsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
