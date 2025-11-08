"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import NameMessage from "./NameMessage";
import { db } from "@/lib/donation";

export default function NameForm() {
  const [name, setName] = useState("");
  const isValid = name.trim().length > 0;

  useEffect(() => {
    // Get name from db
    (async () => {
      const userName = await db.settings.get("user.name");
      if (userName && userName.value) {
        setName(userName.value);
      }
    })();
  }, []);

  return (
    <>
      <TextField
        variant="standard"
        size="medium"
        label="Your name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        aria-label="Your name"
      />
      <Link
        style={{
          cursor: "default",
        }}
        href={isValid ? "/onboarding/offline" : "#"}
      >
        <Button
          size="large"
          color="primary"
          disabled={!isValid}
          variant="outlined"
          endIcon={<ChevronRight />}
          onClick={async () => {
            // Save name to db
            await db.settings.put({ key: "user.name", value: name.trim() });
          }}
        >
          Continue
        </Button>
      </Link>
      <NameMessage message={isValid ? "loading" : null} />
    </>
  );
}
