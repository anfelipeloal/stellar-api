import {
    Controller, Get,
} from '@nestjs/common';
import { RoomType } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomTypesService } from './room-types.service';

@Controller('room-types')
export class RoomTypesController {
    constructor(
        private readonly roomTypesService: RoomTypesService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Find all room types' })
    @ApiResponse({ status: 200, description: 'Room types found' })
    async findAll(): Promise<RoomType[]> {
        try {
            return this.roomTypesService.findAll();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
