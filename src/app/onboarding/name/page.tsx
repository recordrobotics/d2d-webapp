import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NameForm from "./NameForm";

export default function OnboardingName() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      p="20px 19px 0px 19px"
      gap="62px"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h5">
        What is DOOR 2 DOOR?
        <Typography variant="body1" component="div" mt={2}>
          DOOR 2 DOOR helps you keep track of donations you receive while doing
          fundraising.
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
    </Box>
  );
}
