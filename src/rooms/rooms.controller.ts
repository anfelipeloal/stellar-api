import {
    Controller, Get, HttpException, Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { FindAvailableRoomsDto } from './dto/find-available-rooms.dto';
import { ValidateDatesPipe } from './pipes/validate-dates/validate-dates.pipe';

@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) {}

    @Get('available')
    @ApiOperation({ summary: 'Find available rooms' })
    @ApiResponse({ status: 200, description: 'Rooms found' })
    @ApiResponse({ status: 400, description: 'Invalid parameters' })
    async findAvailable(@Query(ValidateDatesPipe) data: FindAvailableRoomsDto) {
        try {
            return this.roomsService.findAvailableRooms(data);
        } catch (error) {
            console.error(error);
            throw new HttpException(error, error.status);
        }
    }
}
