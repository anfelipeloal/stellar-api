import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean, IsDate, IsInt, IsOptional,
} from 'class-validator';

export class FindAvailableRoomsDto {
    @ApiProperty({
        description: 'Date format: YYYY-MM-DD',
    })
    @IsDate()
    @Type(() => Date)
        checkInDate: Date;

    @ApiProperty({
        description: 'Date format: YYYY-MM-DD',
    })
    @IsDate()
    @Type(() => Date)
        checkOutDate: Date;

    @ApiProperty()
    @IsInt()
    @Type(() => Number)
        guests: number;

    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
        breakfast: boolean;

    @ApiProperty(
        {
            description: 'Use the GET /room-types endpoint to get the available room types',
        },
    )
    @IsInt()
    @IsOptional()
    @Type(() => Number)
        roomTypeId: number;
}
