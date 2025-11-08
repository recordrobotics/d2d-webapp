import { nanoid } from "nanoid";

declare const userIdBrand: unique symbol
export type UserId = string & { [userIdBrand]: true }

export function createUserId(): UserId {
    return nanoid<UserId>();
}

export interface Donation {
    id: UserId;
    timestamp: number; // UTC timestamp in milliseconds
    amount: number; // Donation amount in cents
    address: {
        streetNumber: number,
        streetName: string,
        city: string
    },
    donor: {
        name?: string,
        email?: string,
        paymentType: 'cash' | 'check' | 'paypal'
    }
};