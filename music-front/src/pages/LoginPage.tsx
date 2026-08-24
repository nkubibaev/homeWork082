import { type SubmitEvent, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Container, Link, Paper, TextField, Typography } from '@mui/material';
import axiosApi from '../api/axiosApi';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (event: SubmitEvent) => {
        event.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const response = await axiosApi.post('/users/sessions', { username, password });
            login(response.data);
            navigate('/');
        } catch (error) {
            console.error(error);
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        width: '100%',
                        p: 4,
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={submitHandler}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Login...' : 'Login'}
                        </Button>
                    </Box>
                    <Typography sx={{ mt: 3, textAlign: 'center' }}>
                        No account?
                        <Link
                            component={RouterLink}
                            to="/register"
                        >
                            Register
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;