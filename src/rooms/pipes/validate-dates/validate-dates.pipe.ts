import {
    ArgumentMetadata, HttpException, Injectable, PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateDatesPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.checkOutDate <= value.checkInDate) {
            throw new HttpException('Check-out date must be greater than check-in date', 400);
        }

        return value;
    }
}
