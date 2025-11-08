import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";

export default function UserStatus({
  name,
  verified,
}: {
  name: string;
  verified: boolean;
}) {
  return (
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
          <Box display="flex" flexDirection="row" gap="3px" alignItems="center">
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
        <Button size="large" color="primary" variant="text">
          Rename
        </Button>
      </Box>
      <Typography variant="body1">
        Last sync:{" "}
        <Typography variant="body2" component="span">
          11/5/2025 11:27 PM
        </Typography>
      </Typography>
    </Box>
  );
}
