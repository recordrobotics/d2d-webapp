import { DonationData, rateLimit, sheet } from "../sheets";

export async function POST(request: Request) {
    if (rateLimit(request)) {
        return new Response("Too many requests", { status: 429 });
    }

    const data = await request.json();

    const userName = data.name;
    if (!userName) {
        return Response.json({ error: "No name provided." }, { status: 400 });
    }

    const donationData = await sheet.getRows<DonationData>();

    const userDonations = donationData.find(
        (row) => row.get("name") === userName
    );

    return Response.json({ exists: userDonations ? true : false });
}
