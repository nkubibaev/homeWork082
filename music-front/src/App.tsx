import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import ArtistsPage from './pages/ArtistsPage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';

const App = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
            }}
        >
            <AppBar
                position="sticky"
                elevation={0}
            >
                <Toolbar>
                    <Typography
                        variant="h5"
                        component={NavLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                            fontWeight: 700,
                            letterSpacing: 1,
                        }}
                    >
                        Music App
                    </Typography>

                    <Button
                        color="inherit"
                        component={NavLink}
                        to="/"
                        sx={{
                            fontWeight: 600,
                        }}
                    >
                        Artists
                    </Button>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="lg"
                sx={{
                    py: {
                        xs: 3,
                        md: 5,
                    },
                }}
            >
                <Routes>
                    <Route path="/" element={<ArtistsPage />} />
                    <Route path="/artists/:id" element={<ArtistPage />} />
                    <Route path="/albums/:id" element={<AlbumPage />} />
                </Routes>
            </Container>
        </Box>
    );
};

export default App;