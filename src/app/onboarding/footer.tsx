import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function OnboardingFooter() {
  return (
    <Box
      flex="1 1 auto"
      display="flex"
      alignItems="flex-end"
      justifyContent="center"
      width="100%"
    >
      <Typography variant="caption">Made by Record Robotics</Typography>
    </Box>
  );
}
