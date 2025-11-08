"use client";

import Button from "@mui/material/Button";
import Logout from "@mui/icons-material/Logout";
import { deleteCookie } from "cookies-next";
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
        deleteCookie("onboardingComplete");
        await db.donations.clear();
        router.push("/onboarding");
      }}
    >
      Log Out
    </Button>
  );
}
