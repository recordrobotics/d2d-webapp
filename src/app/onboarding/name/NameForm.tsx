"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TextField from "@mui/material/TextField";

export default function NameForm() {
  const [name, setName] = useState("");
  const isValid = name.trim().length > 0;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="19px"
      alignItems="center"
      width="100%"
    >
      <TextField
        variant="standard"
        size="medium"
        label="Your name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        inputProps={{ "aria-label": "Your name" }}
      />
      <Button
        size="large"
        color="primary"
        disabled={!isValid}
        variant="outlined"
        endIcon={<ChevronRight />}
      >
        Continue
      </Button>
    </Box>
  );
}
