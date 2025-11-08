import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import OnboardingFooter from "../footer";
import PageMotion from "@/app/PageMotion";

export default function OnboardingName() {
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
          Fully offline
        </Typography>
        <Typography variant="body1" width="100%">
          All donations you create will be saved locally, on-device. Once an
          internet connection becomes available, press the{" "}
          <Typography variant="caption" component="span" fontWeight="800">
            PUBLISH DONATIONS
          </Typography>{" "}
          button to upload your donations to the internet.
          <br />
          <br />
          If you already have donations you published earlier and want to save
          them locally on this device, press the{" "}
          <Typography variant="caption" component="span" fontWeight="800">
            FETCH DONATIONS
          </Typography>{" "}
          button.
          <br />
          <br />
          In addition, donations will be automatically fetched and published
          periodically when internet is available.
        </Typography>
        <Link href="/onboarding/multiple-devices">
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
