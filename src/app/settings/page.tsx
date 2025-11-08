"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageMotion from "../PageMotion";
import TopBar from "../TopBar";
import UserStatus from "./UserStatus";
import LogOutButton from "./LogOutButton";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/donation";

export default function Settings() {
  const userName = useLiveQuery(() => db.settings.get("user.name"), []);
  const userVerified = useLiveQuery(() => db.settings.get("user.verified"), []);
  const lastSyncTime = useLiveQuery(
    () => db.settings.get("user.lastSyncTime"),
    []
  );

  const lastSyncTimeNumber =
    lastSyncTime && !isNaN(parseInt(lastSyncTime.value))
      ? parseInt(lastSyncTime.value)
      : undefined;

  return (
    <PageMotion>
      <Box
        display="flex"
        flexDirection="column"
        p="20px 19px 20px 19px"
        gap="21px"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        maxWidth="600px"
      >
        <TopBar>Settings</TopBar>
        <UserStatus
          name={userName ? userName.value : "<UNKNOWN>"}
          verified={
            userVerified && userVerified.value === "true" ? true : false
          }
          lastSyncTime={lastSyncTimeNumber}
        />
        <Typography variant="caption" color="textSecondary">
          Changing your name keeps all of your donations and replaces the
          student name with your new name as soon as an internet connection is
          available.{" "}
          <Typography variant="caption" fontWeight="700">
            To switch to a different student, log out instead.
          </Typography>
        </Typography>
        <LogOutButton />
        <Typography variant="caption" color="textSecondary">
          By logging out, all local data is removed from this device. All
          published and online donations are kept, but any local donations will
          be lost forever.
        </Typography>
      </Box>
    </PageMotion>
  );
}
