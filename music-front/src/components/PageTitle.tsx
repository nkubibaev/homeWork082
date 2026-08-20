import { Box, Typography } from '@mui/material';

interface Props {
    title: string;
    subtitle?: string | null;
}

const PageTitle = ({ title, subtitle = null }: Props) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
            >
                {title}
            </Typography>

            {subtitle !== null && (
                <Typography
                    color="text.secondary"
                    variant="body1"
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default PageTitle;