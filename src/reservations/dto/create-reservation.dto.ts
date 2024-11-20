import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean, IsDate, IsInt, IsString,
} from 'class-validator';

export class CreateReservationDto {
    @ApiProperty()
    @IsInt()
        roomId: number;

    @ApiProperty()
    @IsString()
        guestName: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
        checkInDate: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
        checkOutDate: Date;

    @ApiProperty()
    @IsInt()
        guests: number;

    @ApiProperty()
    @IsBoolean()
        breakfast: boolean;
}
