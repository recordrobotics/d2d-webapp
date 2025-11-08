import PageMotion from "../../PageMotion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DonationForm from "../DonationForm";
import TopBar from "../../TopBar";

export default function EditDonation() {
  return (
    <PageMotion>
      <Box
        display="flex"
        flexDirection="column"
        p="20px 19px"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        maxWidth="600px"
      >
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          gap="14px"
          alignItems="center"
          p="11px 0px"
        >
          <TopBar>Edit donation</TopBar>
          <Typography variant="body2">
            Write checks to Belmont STEAM Alliance Corp. and send them to 58
            Pinehurst Rd, Belmont, MA02478. Belmont STEAM Alliance Corp. is a
            registered 501(c)(3). All contributions are tax-deductible.
          </Typography>
        </Box>
        <DonationForm />
      </Box>
    </PageMotion>
  );
}
