import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h1"
                    component="h1"
                    sx={{ fontWeight: 'bold' }}
                >
                    404
                </Typography>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{ mb: 2 }}
                >
                    Page Not Found
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    The page you are looking for does not exist.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/"
                    variant="contained"
                >
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;