import {
    DonationData,
    rateLimit,
    sheet,
    UserUpdateData,
    userUpdatesSheet,
} from "../sheets";

export async function POST(request: Request) {
    if (rateLimit(request)) {
        return new Response("Too many requests", { status: 429 });
    }

    const data = await request.json();

    const updateTime = data.updateTime ? parseInt(data.updateTime) : undefined;

    if (!data.lastSyncName) {
        return Response.json(
            {
                error: "No lastSyncName provided.",
            },
            { status: 400 }
        );
    }

    if (!data.name) {
        return Response.json(
            {
                error: "No name provided.",
            },
            { status: 400 }
        );
    }

    const userUpdateData = await userUpdatesSheet.getRows<UserUpdateData>();

    const lastUserUpdateTime = userUpdateData.find(
        (row) => row.get("name") === data.lastSyncName
    );

    if (data.name !== data.lastSyncName && lastUserUpdateTime) {
        console.log(
            `User changed name from ${data.lastSyncName} to ${data.name}, changing lastUserUpdateTime`
        );

        const lastUserUpdateTimeNewName = userUpdateData.find(
            (row) => row.get("name") === data.name
        );

        if (lastUserUpdateTimeNewName) {
            // Delete the old entry
            await lastUserUpdateTimeNewName.delete();
        }

        lastUserUpdateTime.set("name", data.name);
        await lastUserUpdateTime.save();
    }

    if (updateTime && !lastUserUpdateTime) {
        // Log the user update time
        await userUpdatesSheet.addRow({
            name: data.name,
            updateTime: updateTime,
        });
        console.log(`Added user update time for ${data.name}: ${updateTime}`);
    } else if (
        updateTime &&
        lastUserUpdateTime &&
        parseInt(lastUserUpdateTime.get("updateTime") || "0") < updateTime
    ) {
        lastUserUpdateTime.set("updateTime", updateTime);
        await lastUserUpdateTime.save();
        console.log(`Updated user update time for ${data.name}: ${updateTime}`);
    } else if (
        lastUserUpdateTime &&
        (!updateTime ||
            parseInt(lastUserUpdateTime.get("updateTime") || "0") > updateTime)
    ) {
        console.log(
            `User update time for ${
                data.name
            } is newer on server: ${lastUserUpdateTime.get("updateTime")}`
        );

        const donationData = await sheet.getRows<DonationData>();

        if (data.name !== data.lastSyncName && lastUserUpdateTime) {
            console.log(
                `User changed name from ${data.lastSyncName} to ${data.name}, changing donationData`
            );
            // Change all donations with old name to new name
            const rowsToUpdate = donationData.filter(
                (row) => row.get("name") === data.lastSyncName
            );
            for (const row of rowsToUpdate) {
                row.set("name", data.name);
                await row.save();
            }
        }

        return Response.json({
            updateTime: parseInt(lastUserUpdateTime.get("updateTime") || "0"),
            donations: donationData
                .filter((row) => row.get("name") === data.name)
                .map((row) => ({
                    name: row.get("name") || "",
                    id: row.get("id") || "",
                    timestamp: parseInt(row.get("timestamp") || "0"),
                    amount: parseFloat(row.get("amount") || "0"),
                    address: {
                        streetNumber: parseInt(row.get("streetNumber") || "0"),
                        streetName: row.get("streetName") || "",
                        city: row.get("city") || "",
                    },
                    donor: {
                        name: row.get("donorName") || undefined,
                        email: row.get("donorEmail") || undefined,
                        paymentType: row.get("paymentType") || "",
                    },
                })),
        });
    } else if (
        lastUserUpdateTime &&
        updateTime &&
        parseInt(lastUserUpdateTime.get("updateTime") || "0") === updateTime
    ) {
        console.log(`No updates needed for user ${data.name}`);

        if (data.name !== data.lastSyncName && lastUserUpdateTime) {
            console.log(
                `User changed name from ${data.lastSyncName} to ${data.name}, changing donationData`
            );
            const donationData = await sheet.getRows<DonationData>();
            // Change all donations with old name to new name
            const rowsToUpdate = donationData.filter(
                (row) => row.get("name") === data.lastSyncName
            );
            for (const row of rowsToUpdate) {
                row.set("name", data.name);
                await row.save();
            }
        }

        return Response.json({
            updateTime: updateTime,
            donations: data.donations,
        });
    }

    // Overwrite all donations for this user
    const donationData = await sheet.getRows<DonationData>();
    const rowsToDelete = donationData.filter(
        (row) => row.get("name") === data.lastSyncName
    );
    for (const row of rowsToDelete) {
        await row.delete();
    }
    console.log(
        `Deleted ${rowsToDelete.length} rows for user ${data.lastSyncName}`
    );

    // Add new donations
    for (const donation of data.donations) {
        await sheet.addRow({
            name: donation.name,
            id: donation.id,
            timestamp: donation.timestamp,
            amount: donation.amount,
            streetNumber: donation.address.streetNumber,
            streetName: donation.address.streetName,
            city: donation.address.city,
            donorName: donation.donor.name || "",
            donorEmail: donation.donor.email || "",
            paymentType: donation.donor.paymentType,
        });
    }

    console.log(`Added ${data.donations.length} rows for user ${data.name}`);

    return Response.json({
        updateTime: updateTime || Date.now(),
        donations: data.donations,
    });
}
