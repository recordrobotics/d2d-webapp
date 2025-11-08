"use client";

import Box from "@mui/material/Box";
import Warning from "@mui/icons-material/Warning";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function NameMessage({
  message,
}: {
  message?: "already_used" | "not_verified" | "verified" | "loading" | null;
}) {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" flexDirection="row" gap="3px" alignItems="center">
        {message === "already_used" && (
          <>
            <Warning
              fontSize="inherit"
              sx={{ fontSize: "14px" }}
              color="warning"
            />
            <Typography variant="caption" color="warning">
              Warning
            </Typography>
          </>
        )}
        {message === "not_verified" && (
          <>
            <Cancel
              fontSize="inherit"
              sx={{ fontSize: "14px" }}
              color="error"
            />
            <Typography variant="caption" color="error">
              Not Verified
            </Typography>
          </>
        )}
        {message === "verified" && (
          <>
            <CheckCircle
              fontSize="inherit"
              sx={{ fontSize: "14px" }}
              color="success"
            />
            <Typography variant="caption" color="success">
              Verified
            </Typography>
          </>
        )}
        {message === "loading" && (
          <>
            <CircularProgress color="inherit" size="14px" enableTrackSlot />
            <Typography variant="caption" color="textPrimary">
              Verifying your name
            </Typography>
          </>
        )}
      </Box>
      {message === "already_used" && (
        <Typography
          variant="caption"
          color="warning"
          whiteSpace="wrap"
          maxWidth="250px"
        >
          Your name is already being used on another device. If that is not you,
          choose a different name.
        </Typography>
      )}
      {message === "not_verified" && (
        <Typography
          variant="caption"
          color="error"
          whiteSpace="wrap"
          maxWidth="250px"
        >
          A stable internet connection is required to verify your name.
        </Typography>
      )}
      {message === "verified" && (
        <Typography
          variant="caption"
          color="success"
          whiteSpace="wrap"
          maxWidth="250px"
        >
          Your name has been verified to be valid using an internet connection.
        </Typography>
      )}
      {message === "loading" && (
        <Typography
          variant="caption"
          color="textSecondary"
          whiteSpace="wrap"
          maxWidth="250px"
        >
          Please wait while we verify your name. This may take a few seconds.
        </Typography>
      )}
    </Box>
  );
}
