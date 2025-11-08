import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import PageMotion from "../PageMotion";

export default function OnboardingWelcome() {
  return (
    <PageMotion>
      <Box
        display="flex"
        flexDirection="column"
        p="20px 19px 20px 19px"
        gap="21px"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h6" align="center">
          Welcome to
          <Typography variant="h3" component="div">
            DOOR 2 DOOR
          </Typography>
        </Typography>
        <Link href="/onboarding/name">
          <Button
            size="large"
            color="primary"
            variant="outlined"
            endIcon={<ChevronRight />}
          >
            Get Started
          </Button>
        </Link>
      </Box>
    </PageMotion>
  );
}
