import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import ArtistsPage from './pages/ArtistsPage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TrackHistoryPage from './pages/TrackHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import axiosApi from './api/axiosApi';

const App = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const handleLogout = async () => {
        try {
            await axiosApi.delete('/users/sessions');
        } catch (error) {
            console.error(error);
        } finally {
            logout();
            navigate('/');
        }
    };

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
                <Toolbar sx={{ gap: 1 }}>
                    <Typography
                        variant="h5"
                        component={NavLink}
                        to="/"
                        sx={{
                            mr: 'auto',
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
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/track-history"
                            >
                                Track History
                            </Button>
                            <Typography
                                sx={{
                                    ml: 1,
                                    mr: 1,
                                    fontWeight: 600,
                                }}
                            >
                                {user.username}
                            </Typography>
                            <Button
                                color="inherit"
                                onClick={() =>
                                    void handleLogout()
                                }
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
                            >
                                Sign Up
                            </Button>
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/login"
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
                    <Route path="/track-history" element={<TrackHistoryPage />} />
                    <Route element={<ProtectedRoute />} />
                </Routes>
            </Container>
        </Box>
    );
};

export default App;