import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import creds from "./.config/d2d-webapp-477707-6b7d31a619b6.json";

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(creds.sheet_id, serviceAccountAuth);
await doc.loadInfo(); // loads document properties and worksheets
console.log("Connected to Google Docs API: " + doc.title);

let sheet = doc.sheetsByTitle["donations"];
let userUpdatesSheet = doc.sheetsByTitle["userUpdates"];

export interface DonationData {
    name: string;
    id: string;
    timestamp: number;
    amount: number;
    streetNumber: number;
    streetName: string;
    city: string;
    donorName: string;
    donorEmail: string;
    paymentType: string;
    note: string;
}

export interface UserUpdateData {
    name: string;
    updateTime: number;
}

if (!sheet) {
    sheet = await doc.addSheet({
        title: "donations",
        headerValues: [
            "name",
            "id",
            "timestamp",
            "amount",
            "streetNumber",
            "streetName",
            "city",
            "donorName",
            "donorEmail",
            "paymentType",
            "note",
        ],
    });
    console.log("Created new sheet: donations");
}

if (!userUpdatesSheet) {
    userUpdatesSheet = await doc.addSheet({
        title: "userUpdates",
        headerValues: ["name", "updateTime"],
    });
    console.log("Created new sheet: userUpdates");
}

const requests = new Map<string, { count: number; firstRequest: number }>();
const WINDOW = 60_000;
const LIMIT = 5;

export const rateLimit = (request: Request): boolean => {
    const ip =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("host") ||
        "unknown";
    const now = Date.now();
    const entry = requests.get(ip);

    if (!entry) {
        requests.set(ip, { count: 1, firstRequest: now });
    } else if (now - entry.firstRequest < WINDOW) {
        entry.count++;
        if (entry.count > LIMIT) {
            return true;
        }
    } else {
        requests.set(ip, { count: 1, firstRequest: now });
    }

    return false;
};

export { sheet, userUpdatesSheet };
