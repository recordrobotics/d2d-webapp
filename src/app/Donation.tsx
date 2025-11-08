"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Donation } from "@/lib/donation";
import { useFormatter } from "next-intl";
import Link from "next/link";
import donationlistStyles from "./donationlist.module.css";

export default function DonationItem({ donation }: { donation: Donation }) {
  const format = useFormatter();
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Link
      href={`/donation/edit#${donation.id}`}
      className={donationlistStyles.item}
      draggable={false}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        p="5px"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          p="10px"
          width="100%"
        >
          <Typography variant="h5">
            {"$" + donation.amount.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            {donation.address.streetNumber +
              " " +
              donation.address.streetName +
              ", " +
              donation.address.city}
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary">
          {format.dateTime(new Date(donation.timestamp), {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZone: clientTimeZone,
          })}
        </Typography>
      </Box>
    </Link>
  );
}
