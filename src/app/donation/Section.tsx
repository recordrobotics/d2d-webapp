import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export default function Section({
  title,
  subtitle,
  divider,
  children,
}: {
  title: string;
  subtitle?: string;
  divider?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Box display="flex" flexDirection="column" p="16px 0px" width="100%">
      <Box display="flex" flexDirection="column" gap="8px">
        <Typography variant="h5">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" gutterBottom>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
      <Box width="4px" height="8px" />
      {divider && <Divider variant="fullWidth" />}
    </Box>
  );
}
