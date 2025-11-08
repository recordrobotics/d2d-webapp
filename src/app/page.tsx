"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import PageMotion from "./PageMotion";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/donation";
import DonationItem from "./Donation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Home() {
  const donations = useLiveQuery(
    () => db.donations.orderBy("timestamp").reverse().toArray(),
    []
  );
  const userName = useLiveQuery(() => db.settings.get("user.name"), []);

  const router = useRouter();
  if (
    typeof location === "object" &&
    getCookie("onboardingComplete") !== "true"
  ) {
    router.replace("/onboarding");
  }

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
            Welcome, {userName ? userName.value : "student"}!
            <Typography variant="body1" component="div">
              {donations && donations.length > 0
                ? "You are currently offline. Publishing and fetching donations may not work."
                : "You have no donations collected yet."}
            </Typography>
          </Typography>
          <Typography variant="h3" align="center">
            {"$" +
              (donations
                ? donations.reduce((sum, donation) => sum + donation.amount, 0)
                : 0
              ).toFixed(2)}
            <Typography variant="body1">Total donated</Typography>
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
              {donations && donations.length > 0
                ? "Publish Donations"
                : "Fetch Donations"}
            </Button>
          </Box>
        </Box>
        <Stack gap="16px" width="100%">
          {donations &&
            donations.map((donation) => (
              <DonationItem key={donation.id} donation={donation} />
            ))}
        </Stack>
      </Box>
    </PageMotion>
  );
}
