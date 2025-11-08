import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NameForm from "./NameForm";
import OnboardingFooter from "../footer";
import PageMotion from "@/app/PageMotion";

export default function OnboardingName() {
  return (
    <PageMotion>
      <Box
        display="flex"
        flexDirection="column"
        p="80px 19px 20px 19px"
        gap="62px"
        alignItems="center"
        minHeight="100vh"
        maxWidth="600px"
      >
        <Typography variant="h5">
          What is DOOR 2 DOOR?
          <Typography variant="body1" component="div" mt={2}>
            DOOR 2 DOOR helps you keep track of donations you receive while
            doing fundraising.
          </Typography>
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          gap="19px"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h6" fontWeight="500">
            Begin by signing up with your name
          </Typography>
          <NameForm />
        </Box>
        <OnboardingFooter />
      </Box>
    </PageMotion>
  );
}
