import {type ChangeEvent, type SubmitEvent, useState} from 'react';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../api/axiosApi';

const AddArtistPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [information, setInformation] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const data = new FormData();

            data.append('name', name.trim());
            data.append('information', information.trim());

            if (photo !== null) {
                data.append('photo', photo);
            }

            await axiosApi.post('/artists', data);

            navigate('/');
        } catch (error) {
            console.error(error);

            setError('Failed to create artist');
        } finally {
            setLoading(false);
        }
    };

    const changePhotoHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0) ?? null;

        setPhoto(file);
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ mb: 3 }}
                >
                    Add artist
                </Typography>

                {error !== null && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={submitHandler}>
                    <TextField
                        fullWidth
                        required
                        label="Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Information"
                        value={information}
                        onChange={(e) =>
                            setInformation(
                                e.target.value,
                            )
                        }
                        margin="normal"
                        multiline
                        minRows={4}
                    />
                    <Button
                        component="label"
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        {photo === null ? 'Choose photo' : photo.name}
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={changePhotoHandler}
                        />
                    </Button>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'Creating...' : 'Create artist'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddArtistPage;