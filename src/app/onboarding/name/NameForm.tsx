"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import NameMessage from "./NameMessage";

export default function NameForm() {
  const [name, setName] = useState("");
  const isValid = name.trim().length > 0;

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
        >
          Continue
        </Button>
      </Link>
      <NameMessage message={isValid ? "loading" : null} />
    </>
  );
}
