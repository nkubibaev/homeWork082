import {type ChangeEvent, type SubmitEvent, useEffect, useState} from 'react';
import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../api/axiosApi';
import type { Artist } from '../types';

const AddAlbumPage = () => {
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [year, setYear] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axiosApi<Artist[]>('/artists');

                setArtists(response.data);
            } catch (error) {
                console.error(error);

                setError('Failed to load artists');
            }
        };

        void fetchArtists();
    }, []);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = new FormData();

            data.append('name', name.trim());
            data.append('artist', artist);
            data.append('year', year);

            if (image !== null) {
                data.append('image', image);
            }

            await axiosApi.post('/albums', data);

            navigate(`/artists/${artist}`);
        } catch (error) {
            console.error(error);

            setError('Failed to create album');
        } finally {
            setLoading(false);
        }
    };

    const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0) ?? null;

        setImage(file);
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ mb: 3 }}
                >
                    Add album
                </Typography>

                {error !== null && (
                    <Alert severity="error" sx={{ mb: 2 }}>
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
                    <FormControl
                        fullWidth
                        margin="normal"
                        required
                    >
                        <InputLabel id="artist-label">
                            Artist
                        </InputLabel>
                        <Select
                            labelId="artist-label"
                            value={artist}
                            label="Artist"
                            onChange={(e) =>
                                setArtist(
                                    e.target.value,
                                )
                            }
                        >
                            {artists.map((item) => (
                                <MenuItem
                                    value={item._id}
                                    key={item._id}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Year"
                        value={year}
                        onChange={(event) =>
                            setYear(event.target.value)
                        }
                        margin="normal"
                    />
                    <Button
                        component="label"
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        {image === null ? 'Choose album image' : image.name}
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={changeImageHandler}
                        />
                    </Button>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={ loading || artist === '' }
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'Creating...' : 'Create album'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddAlbumPage;