import { Reservation } from '@prisma/client';

export interface FindAllResponse {
    cancelled: Reservation[];
    past: Reservation[]
    future: Reservation[]
    ongoing: Reservation[]
}
