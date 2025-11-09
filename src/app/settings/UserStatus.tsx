"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { useFormatter } from "next-intl";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { db } from "@/lib/donation";

export default function UserStatus({
  name,
  verified,
  lastSyncTime,
}: {
  name: string;
  verified: boolean;
  lastSyncTime?: number;
}) {
  const format = useFormatter();
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameName, setRenameName] = useState("");

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        p="12px 25px"
        gap="7px"
        sx={{
          border: "1px solid #C4C4C4",
          borderRadius: "13px",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">
              Name:{" "}
              <Typography variant="body2" component="span">
                {name + " "}
              </Typography>
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              gap="3px"
              alignItems="center"
            >
              {verified ? (
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
              ) : (
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
            </Box>
            {verified ? (
              <Typography
                variant="caption"
                color="success"
                whiteSpace="wrap"
                maxWidth="250px"
              >
                Your name has been verified to be valid using an internet
                connection
              </Typography>
            ) : (
              <Typography
                variant="caption"
                color="error"
                whiteSpace="wrap"
                maxWidth="250px"
              >
                A stable internet connection is required to verify your name
              </Typography>
            )}
          </Box>
          <Button
            size="large"
            color="primary"
            variant="text"
            onClick={() => setShowRenameDialog(true)}
          >
            Rename
          </Button>
        </Box>
        <Typography variant="body1">
          Last sync:{" "}
          <Typography variant="body2" component="span">
            {lastSyncTime
              ? format.dateTime(new Date(lastSyncTime), {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: clientTimeZone,
                })
              : "Never"}
          </Typography>
        </Typography>
      </Box>
      <Dialog
        open={showRenameDialog}
        onClose={() => {
          setShowRenameDialog(false);
          setRenameName("");
        }}
      >
        <DialogTitle>Change your name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your new name below. This name will be used to identify
            you.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            size="medium"
            label="New name"
            autoComplete="name"
            aria-label="New name"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value.trimStart())}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowRenameDialog(false);
              setRenameName("");
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={renameName.trim().length <= 0}
            onClick={async () => {
              setShowRenameDialog(false);
              setRenameName("");

              // Rename user in db
              await db.settings.put({
                key: "user.name",
                value: renameName.trim(),
              });
              await db.settings.put({ key: "user.verified", value: "false" });
            }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
