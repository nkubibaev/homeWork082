import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import ArtistsPage from './pages/ArtistsPage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';

const App = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
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

                    {user ? (
                        <>
                            <Typography
                                sx={{
                                    ml: 2,
                                    mr: 2,
                                    fontWeight: 600,
                                }}
                            >
                                {user.username}
                            </Typography>

                            <Button
                                color="inherit"
                                onClick={logout}
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/register"
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                Sign Up
                            </Button>
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/login"
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                Sign In
                            </Button>
                        </>
                    )}
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
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </Container>
        </Box>
    );
};

export default App;