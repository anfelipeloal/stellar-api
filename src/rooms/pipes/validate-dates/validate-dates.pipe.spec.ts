import { ArgumentMetadata, HttpException } from '@nestjs/common';
import { ValidateDatesPipe } from './validate-dates.pipe';

describe('ValidateDatesPipe', () => {
    let pipe: ValidateDatesPipe;

    beforeEach(() => {
        pipe = new ValidateDatesPipe();
    });

    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });

    it('should throw an error if checkOutDate is less than or equal to checkInDate', () => {
        const value = { checkInDate: new Date('2023-01-01'), checkOutDate: new Date('2023-01-01') };
        const metadata: ArgumentMetadata = { type: 'body', metatype: null, data: '' };

        expect(() => pipe.transform(value, metadata)).toThrow(HttpException);
        expect(() => pipe.transform(value, metadata)).toThrow('Check-out date must be greater than check-in date');
    });

    it('should return the value if checkOutDate is greater than checkInDate', () => {
        const value = { checkInDate: new Date('2023-01-01'), checkOutDate: new Date('2023-01-02') };
        const metadata: ArgumentMetadata = { type: 'body', metatype: null, data: '' };

        expect(pipe.transform(value, metadata)).toEqual(value);
    });
});
