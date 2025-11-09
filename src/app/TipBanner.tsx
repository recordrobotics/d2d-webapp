import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TrapFocus from "@mui/material/Unstable_TrapFocus";

export default function TipBanner({
  open,
  closeBanner,
}: {
  open: boolean;
  closeBanner: (reason: "cancel" | "agree") => void;
}) {
  return (
    <TrapFocus open disableAutoFocus disableEnforceFocus>
      <Fade appear={false} in={open}>
        <Paper
          role="dialog"
          aria-modal="false"
          aria-label="Cookie banner"
          square
          variant="outlined"
          tabIndex={-1}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            m: 0,
            p: 2,
            borderWidth: 0,
            borderTopWidth: 1,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ justifyContent: "space-between", gap: 2 }}
          >
            <Box
              sx={{
                flexShrink: 1,
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Speed up adding donations
              </Typography>
              <Typography variant="body2">
                You can enable “Automatically add new donation on submit” to
                quickly add multiple donations without returning to the main
                page.
              </Typography>
            </Box>
            <Stack
              direction={{
                xs: "row-reverse",
                sm: "row",
              }}
              sx={{
                gap: 2,
                flexShrink: 0,
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              <Button
                size="small"
                onClick={() => closeBanner("agree")}
                variant="contained"
              >
                Enable setting
              </Button>
              <Button
                size="small"
                onClick={() => closeBanner("cancel")}
                variant="text"
              >
                Dismiss
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </TrapFocus>
  );
}
