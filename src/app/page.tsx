"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import PageMotion from "./PageMotion";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db, DonationId } from "@/lib/donation";
import DonationItem from "./Donation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import donationlistStyles from "./donationlist.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";

function usePerItemMap<T>() {
  const [map, setMap] = useState<Record<string, T>>({});
  const setItem = (key: string, value: T) =>
    setMap((m) => ({ ...m, [key]: value }));
  return { map, setItem };
}

const trailingActions = (alignLeft: boolean, id: DonationId) => (
  <TrailingActions>
    <SwipeAction
      destructive={true}
      onClick={async () => {
        // Delete donation
        await db.donations.delete(id);
      }}
    >
      <Box
        bgcolor="error.main"
        display="flex"
        flexDirection="row"
        p="0 20px"
        height="100%"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box
          flexGrow={alignLeft ? 0 : 1}
          sx={{
            transition: "flex-grow 0.3s",
          }}
        />
        <Box display="flex" flexDirection="column" alignItems="center">
          <DeleteForeverIcon fontSize="large" htmlColor="#fff" />
          <Typography variant="button" color="#fff">
            Delete
          </Typography>
        </Box>
      </Box>
    </SwipeAction>
  </TrailingActions>
);

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

  const { map: alignLeftMap, setItem: setAlignLeftMap } =
    usePerItemMap<boolean>();

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
        <SwipeableList
          className={donationlistStyles.list}
          destructiveCallbackDelay={350}
          optOutMouseEvents
        >
          {donations &&
            donations.map((donation) => (
              <SwipeableListItem
                key={donation.id}
                trailingActions={trailingActions(
                  alignLeftMap[donation.id],
                  donation.id
                )}
                className={donationlistStyles.listItem}
                onSwipeProgress={(p) => setAlignLeftMap(donation.id, p >= 50)}
              >
                <DonationItem donation={donation} />
              </SwipeableListItem>
            ))}
        </SwipeableList>
      </Box>
    </PageMotion>
  );
}
