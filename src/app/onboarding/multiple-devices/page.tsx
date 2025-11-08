import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import OnboardingFooter from "../footer";
import PageMotion from "@/app/PageMotion";

export default function OnboardingMultipleDevices() {
  return (
    <PageMotion>
      <Box
        display="flex"
        flexDirection="column"
        p="80px 19px 20px 19px"
        gap="31px"
        alignItems="flex-end"
        minHeight="100vh"
        maxWidth="600px"
      >
        <Typography variant="h5" width="100%">
          Multiple devices
        </Typography>
        <Typography variant="body1" width="100%">
          While DOOR 2 DOOR supports having multiple devices logged in to your
          account at the same time,{" "}
          <Typography variant="body1" component="span" fontWeight="800">
            when fetching or publishing it will overwrite all donations to the
            newest version
          </Typography>
          .
        </Typography>
        <Link href="/onboarding/complete">
          <Button
            size="large"
            color="primary"
            variant="outlined"
            endIcon={<ChevronRight />}
          >
            Continue
          </Button>
        </Link>
        <OnboardingFooter />
      </Box>
    </PageMotion>
  );
}
