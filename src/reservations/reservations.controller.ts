import {
    Controller, Get, Post, Body, Param, Delete,
    ParseIntPipe,
    HttpException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidateDatesPipe } from '../rooms/pipes/validate-dates/validate-dates.pipe';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
    constructor(
        private readonly reservationsService: ReservationsService,
    ) {}

    @Post()
    @ApiBody({ type: CreateReservationDto })
    @ApiOperation({ summary: 'Create a reservation' })
    @ApiResponse({ status: 201, description: 'Reservation created' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @ApiResponse({ status: 400, description: 'Invalid parameters' })
    @ApiResponse({ status: 409, description: 'Guests exceed room capacity / Room is not available for requested dates' })
    create(@Body(ValidateDatesPipe) createReservationDto: CreateReservationDto) {
        try {
            return this.reservationsService.create(createReservationDto);
        } catch (error) {
            console.error(error);
            throw new HttpException(error, error.status);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Find all reservations' })
    @ApiResponse({ status: 200, description: 'Reservations found' })
    findAll() {
        try {
            return this.reservationsService.findAll();
        } catch (error) {
            console.error(error);
            throw new HttpException(error, error.status);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a reservation by id' })
    @ApiResponse({ status: 200, description: 'Reservation found' })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.reservationsService.findOne(id);
        } catch (error) {
            console.error(error);
            throw new HttpException(error, error.status);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel a reservation by id' })
    @ApiResponse({ status: 200, description: 'Reservation cancelled' })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    cancel(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.reservationsService.cancel(id);
        } catch (error) {
            console.error(error);
            throw new HttpException(error, error.status);
        }
    }
}
