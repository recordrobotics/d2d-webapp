import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export default function Section({
    title,
    subtitle,
    divider,
    decorator,
    children,
}: {
    title: string;
    subtitle?: string;
    divider?: boolean;
    decorator?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <Box display="flex" flexDirection="column" p="16px 0px" width="100%">
            <Box display="flex" flexDirection="column" gap="8px">
                <Typography variant="h5">
                    {title}
                    {decorator && (
                        <Box display="inline-flex" ml={2}>
                            {decorator}
                        </Box>
                    )}
                </Typography>
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
