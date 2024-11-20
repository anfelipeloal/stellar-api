import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { BREAKFAST_CHARGE, WEEKENDS_CHARGE } from '../config/constants';

describe('PricingService', () => {
    let service: PricingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PricingService],
        }).compile();

        service = module.get<PricingService>(PricingService);
    });

    describe('calculateTotals', () => {
        it('should calculate totals correctly without breakfast and weekends', () => {
            const basePrice = 100;
            const guests = 2;
            const breakfast = false;
            const reservationDays = 3;
            const weekendDays = 0;
            const result = service.calculateTotals(basePrice, guests, breakfast, reservationDays, weekendDays);
            const base = basePrice * reservationDays;
            expect(result).toEqual({
                total: base,
                baseCharge: base,
                weekendsCharge: 0,
                discountByDays: 0,
                breakfastCharge: 0,
            });
        });

        it('should calculate totals correctly without breakfast and weekends and dicount by days', () => {
            const basePrice = 100;
            const guests = 2;
            const breakfast = false;
            const reservationDays = 5;
            const weekendDays = 0;
            const result = service.calculateTotals(basePrice, guests, breakfast, reservationDays, weekendDays);
            const base = basePrice * reservationDays;
            const discount = service.discountByReservationDays(reservationDays);
            expect(result).toEqual({
                total: base - discount,
                baseCharge: base,
                weekendsCharge: 0,
                discountByDays: discount,
                breakfastCharge: 0,
            });
        });

        it('should calculate totals correctly with breakfast and no weekends', () => {
            const basePrice = 100;
            const guests = 2;
            const breakfast = true;
            const reservationDays = 5;
            const weekendDays = 0;
            const result = service.calculateTotals(basePrice, guests, breakfast, reservationDays, weekendDays);
            const base = basePrice * reservationDays;
            const discount = service.discountByReservationDays(reservationDays);
            expect(result).toEqual({
                total: base + (guests * reservationDays * BREAKFAST_CHARGE) - discount,
                baseCharge: base,
                weekendsCharge: 0,
                discountByDays: discount,
                breakfastCharge: guests * reservationDays * BREAKFAST_CHARGE,
            });
        });

        it('should calculate totals correctly with weekends and no breakfast', () => {
            const basePrice = 100;
            const guests = 2;
            const breakfast = false;
            const reservationDays = 5;
            const weekendDays = 2;
            const result = service.calculateTotals(basePrice, guests, breakfast, reservationDays, weekendDays);
            const base = basePrice * reservationDays;
            const discount = service.discountByReservationDays(reservationDays);
            expect(result).toEqual({
                total: base + (basePrice * WEEKENDS_CHARGE * weekendDays) - discount,
                baseCharge: base,
                weekendsCharge: basePrice * WEEKENDS_CHARGE * weekendDays,
                discountByDays: 20,
                breakfastCharge: 0,
            });
        });

        it('should calculate totals correctly with discount', () => {
            const basePrice = 100;
            const guests = 2;
            const breakfast = false;
            const reservationDays = 7;
            const weekendDays = 2;
            const result = service.calculateTotals(basePrice, guests, breakfast, reservationDays, weekendDays);
            const base = basePrice * reservationDays;
            const discount = service.discountByReservationDays(reservationDays);
            expect(result).toEqual({
                total: base + (basePrice * WEEKENDS_CHARGE * weekendDays) - discount,
                baseCharge: base,
                weekendsCharge: basePrice * WEEKENDS_CHARGE * weekendDays,
                discountByDays: discount,
                breakfastCharge: 0,
            });
        });
    });

    describe('daysBetweenDates', () => {
        it('should return 0 if check-in and check-out dates are the same', () => {
            const checkInDate = new Date('2023-10-02');
            const checkOutDate = new Date('2023-10-02');
            expect(service.daysBetweenDates(checkInDate, checkOutDate)).toBe(0);
        });

        it('should return 1 if there is one day between check-in and check-out dates', () => {
            const checkInDate = new Date('2023-10-02');
            const checkOutDate = new Date('2023-10-03');
            expect(service.daysBetweenDates(checkInDate, checkOutDate)).toBe(1);
        });

        it('should return the correct number of days between check-in and check-out dates', () => {
            const checkInDate = new Date('2023-10-01');
            const checkOutDate = new Date('2023-10-10');
            expect(service.daysBetweenDates(checkInDate, checkOutDate)).toBe(9);
        });

        it('should handle leap years correctly', () => {
            const checkInDate = new Date('2020-02-28');
            const checkOutDate = new Date('2020-03-01');
            expect(service.daysBetweenDates(checkInDate, checkOutDate)).toBe(2);
        });

        it('should handle different months correctly', () => {
            const checkInDate = new Date('2023-01-31');
            const checkOutDate = new Date('2023-02-02');
            expect(service.daysBetweenDates(checkInDate, checkOutDate)).toBe(2);
        });
    });

    describe('weekendDaysBetweenDates', () => {
        it('should return 0 if there are no weekend days between dates', () => {
            const checkInDate = new Date('2023-10-02'); // Monday
            const checkOutDate = new Date('2023-10-06'); // Friday
            expect(service.weekendDaysBetweenDates(checkInDate, checkOutDate)).toBe(0);
        });

        it('should return 1 if there is one weekend day between dates', () => {
            const checkInDate = new Date('2023-10-06'); // Friday
            const checkOutDate = new Date('2023-10-08'); // Sunday
            expect(service.weekendDaysBetweenDates(checkInDate, checkOutDate)).toBe(1);
        });

        it('should return 2 if there are two weekend days between dates', () => {
            const checkInDate = new Date('2023-10-06'); // Friday
            const checkOutDate = new Date('2023-10-09'); // Monday
            expect(service.weekendDaysBetweenDates(checkInDate, checkOutDate)).toBe(2);
        });

        it('should return correct number of weekend days for a longer period', () => {
            const checkInDate = new Date('2023-10-01'); // Sunday
            const checkOutDate = new Date('2023-10-15'); // Sunday
            expect(service.weekendDaysBetweenDates(checkInDate, checkOutDate)).toBe(4);
        });
    });

    describe('discountByReservationDays', () => {
        it('should return 0 for 0 to 3 reservation days', () => {
            expect(service.discountByReservationDays(0)).toBe(0);
            expect(service.discountByReservationDays(1)).toBe(0);
            expect(service.discountByReservationDays(2)).toBe(0);
            expect(service.discountByReservationDays(3)).toBe(0);
        });

        it('should return 4 per day for 4 to 6 reservation days', () => {
            expect(service.discountByReservationDays(4)).toBe(16);
            expect(service.discountByReservationDays(5)).toBe(20);
            expect(service.discountByReservationDays(6)).toBe(24);
        });

        it('should return 8 per day for 7 to 9 reservation days', () => {
            expect(service.discountByReservationDays(7)).toBe(56);
            expect(service.discountByReservationDays(8)).toBe(64);
            expect(service.discountByReservationDays(9)).toBe(72);
        });
    });
});
