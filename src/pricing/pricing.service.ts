import { Injectable } from '@nestjs/common';
import { BREAKFAST_CHARGE, DISCOUNT_BY_DAYS, WEEKENDS_CHARGE } from '../config/constants';
import { CalculateTotalsResponse } from './interfaces/calculate-totals-response.interface';

@Injectable()
export class PricingService {
    calculateTotals(basePrice: number, guests: number, breakfast: boolean, reservationDays: number, weekendDays: number): CalculateTotalsResponse {
        const baseCharge = basePrice * reservationDays;
        const weekendsCharge = (basePrice * WEEKENDS_CHARGE) * weekendDays;
        const discountByDays = this.discountByReservationDays(reservationDays);
        const breakfastCharge = breakfast ? guests * reservationDays * BREAKFAST_CHARGE : 0;
        const total = baseCharge + weekendsCharge - discountByDays + breakfastCharge;

        return {
            total,
            baseCharge,
            weekendsCharge,
            discountByDays,
            breakfastCharge,
        };
    }

    daysBetweenDates(checkInDate: Date, checkOutDate: Date): number {
        return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    weekendDaysBetweenDates(checkInDate: Date, checkOutDate: Date): number {
        const days = this.daysBetweenDates(checkInDate, checkOutDate);
        let weekendDays = 0;
        const startDate = new Date(checkInDate);

        for (let i = 0; i < days; i += 1) {
            if (startDate.getUTCDay() === 0 || startDate.getUTCDay() === 6) {
                weekendDays += 1;
            }
            startDate.setDate(startDate.getDate() + 1);
        }

        return weekendDays;
    }

    discountByReservationDays(reservationDays: number): number {
        for (let i = 0; i < DISCOUNT_BY_DAYS.length; i += 1) {
            if (reservationDays >= DISCOUNT_BY_DAYS[i].days) {
                return reservationDays * DISCOUNT_BY_DAYS[i].discount;
            }
        }

        return 0;
    }
}
