import { type SubmitEvent, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Container, Link, Paper, TextField, Typography } from '@mui/material';
import axiosApi from '../api/axiosApi';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('displayName', displayName);

            if (avatar) {
                formData.append('avatar', avatar);
            }

            await axiosApi.post('/users', formData);

            navigate('/login');
        } catch (error) {
            console.error(error);
            setError('Failed to register');
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
                    <Typography variant="h4" component="h1"
                        sx={{
                            mb: 3,
                            textAlign: 'center',
                        }}
                    >
                        Register
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
                            label="Display Name"
                            value={displayName}
                            onChange={(event) =>
                                setDisplayName(event.target.value)
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
                            component="label"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Choose Avatar
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) => {
                                    const files = event.target.files;

                                    if (files && files.length > 0) {
                                        setAvatar(files[0]);
                                    } else {
                                        setAvatar(null);
                                    }
                                }}
                            />
                        </Button>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                color: 'text.secondary',
                            }}
                        >
                            {avatar ? avatar.name : 'No avatar selected'}
                        </Typography>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Register...' : 'Register'}
                        </Button>
                    </Box>
                    <Typography sx={{ mt: 3, textAlign: 'center'}}>
                        Do you already have an account?{' '}
                        <Link component={RouterLink} to="/login">
                            Login
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterPage;