import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Link from "next/link";

export default function TopBar({ children }: { children: React.ReactNode }) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="100%"
      position="relative"
    >
      <Link href="/">
        <Button
          size="large"
          color="primary"
          variant="text"
          startIcon={<ChevronLeft />}
        >
          Back
        </Button>
      </Link>
      <Typography
        variant="h5"
        align="center"
        fontWeight="700"
        flexGrow={1}
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "block",
          "@media (max-width: 300px)": {
            display: "none",
          },
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
