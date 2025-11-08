import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import PageMotion from "@/app/PageMotion";
import MarkOnboardingComplete from "./MarkCompleted";

export default function OnboardingWelcome() {
  return (
    <>
      <MarkOnboardingComplete />
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
          <Typography variant="h4" align="center">
            Congratulations
            <Typography variant="h3" component="div">
              You&rsquo;re ready!
            </Typography>
          </Typography>
          <Link href="/">
            <Button
              size="large"
              color="primary"
              variant="outlined"
              endIcon={<ChevronRight />}
            >
              Start Donating
            </Button>
          </Link>
        </Box>
      </PageMotion>
    </>
  );
}
