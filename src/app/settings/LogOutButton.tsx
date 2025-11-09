"use client";

import Button from "@mui/material/Button";
import Logout from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { db } from "@/lib/donation";

export default function LogOutButton() {
  const router = useRouter();

  return (
    <Button
      size="large"
      color="error"
      variant="outlined"
      startIcon={<Logout />}
      onClick={async () => {
        await db.settings.delete("onboardingComplete");
        await db.settings.delete("hasSeenAutoAddDonationOnSubmitTip");
        await db.settings.delete("hasAddedAtLeastOneDonation");
        await db.settings.delete("donationUpdateTime");
        await db.settings.delete("user.lastSyncedName");
        await db.settings.delete("user.verified");
        await db.settings.delete("user.lastSyncTime");
        await db.settings.delete("user.lastUpdateAttemptTime");
        await db.donations.clear();
        router.push("/onboarding");
      }}
    >
      Log Out
    </Button>
  );
}
