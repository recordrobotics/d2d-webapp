import { nanoid } from "nanoid";
import Dexie, { Table } from 'dexie';

declare const userIdBrand: unique symbol
export type DonationId = string & { [userIdBrand]: true }

export function createDonationId(): DonationId {
    return nanoid<DonationId>();
}

export interface Donation {
    id: DonationId;
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

export class DB extends Dexie {
    donations!: Table<Donation, string>;
    settings!: Table<{key: string, value: string}, string>;
    
  constructor () {
      super('AppDatabase');
      
     this.version(1).stores({
      // Primary key = id, Indexes = timestamp, amount, donor.email, donor.paymentType
         donations: 'id, timestamp, amount, donor.email, donor.paymentType',
         settings: 'key' // primary key is `key`
    });
  }
}

export const db = new DB();