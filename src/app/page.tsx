"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import PageMotion from "./PageMotion";
import Link from "next/link";
import { createUserId, Donation } from "@/lib/donation";
import DonationItem from "./Donation";

export default function Home() {
  return (
    <PageMotion>
      <Box
        display="flex"
        flexDirection="column"
        p="20px 19px"
        alignItems="flex-end"
        minHeight="100vh"
        width="100vw"
        maxWidth="600px"
      >
        <Link href="/settings">
          <Button size="small" color="info" variant="text">
            Settings
          </Button>
        </Link>
        <Box
          display="flex"
          flexDirection="column"
          gap="15px"
          width="100%"
          alignItems="center"
          p="10px"
        >
          <Typography variant="h6" align="center">
            Welcome, Derek
            <Typography variant="body1" component="div">
              {true
                ? "You are currently offline. Publishing and fetching donations may not work."
                : "You have no donations collected yet."}
            </Typography>
          </Typography>
          <Typography variant="h3" align="center">
            $234.00<Typography variant="body1">Total donated</Typography>
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap="5px"
            alignItems="center"
          >
            <Link href="/donation/add">
              <Button
                size="large"
                color="primary"
                variant="outlined"
                startIcon={<Add />}
              >
                New Donation
              </Button>
            </Link>
            <Button size="small" color="info" variant="text">
              {true ? "Publish Donations" : "Fetch Donations"}
            </Button>
          </Box>
        </Box>
        <Stack gap="16px" width="100%">
          {(
            [
              {
                id: createUserId(),
                timestamp: new Date(
                  "Wednesday, November 5, 3:30 PM"
                ).getUTCMilliseconds(),
                address: {
                  streetNumber: 224,
                  streetName: "Calvary Street",
                  city: "Waltham",
                },
                amount: 100,
                donor: {
                  name: "Joseph",
                  paymentType: "cash",
                },
              },
              {
                id: createUserId(),
                timestamp: new Date(
                  "Wednesday, November 5, 3:30 PM"
                ).getUTCMilliseconds(),
                address: {
                  streetNumber: 224,
                  streetName: "Calvary Street",
                  city: "Waltham",
                },
                amount: 100,
                donor: {
                  name: "Joseph",
                  paymentType: "cash",
                },
              },
              {
                id: createUserId(),
                timestamp: new Date(
                  "Wednesday, November 5, 3:30 PM"
                ).getUTCMilliseconds(),
                address: {
                  streetNumber: 224,
                  streetName: "Calvary Street",
                  city: "Waltham",
                },
                amount: 100,
                donor: {
                  name: "Joseph",
                  paymentType: "cash",
                },
              },
            ] as Donation[]
          ).map((donation) => (
            <DonationItem key={donation.id} donation={donation} />
          ))}
        </Stack>
      </Box>
    </PageMotion>
  );
}
