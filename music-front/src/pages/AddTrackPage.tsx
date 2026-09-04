import { type SubmitEvent, useEffect, useState } from 'react';
import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../api/axiosApi';
import type { Album, Artist, Track } from '../types';

const AddTrackPage = () => {
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [name, setName] = useState('');
    const [trackNumber, setTrackNumber] = useState('');
    const [duration, setDuration] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
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

    useEffect(() => {
        setAlbum('');
        setAlbums([]);

        if (artist === '') {
            return;
        }

        const fetchAlbums = async () => {
            try {
                const response = await axiosApi<Album[]>('/albums',
                    { params: { artist }}
                );

                setAlbums(response.data);
            } catch (error) {
                console.error(error);

                setError('Failed to load albums');
            }
        };

        void fetchAlbums();
    }, [artist]);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response =
                await axiosApi.post<Track>('/tracks',
                    {
                        name: name.trim(),
                        album,
                        trackNumber: Number(trackNumber),
                        duration: duration.trim(),
                        youtubeUrl: youtubeUrl.trim() === '' ? null : youtubeUrl.trim(),
                    },
                );

            navigate(`/albums/${response.data.album}`);
        } catch (error) {
            console.error(error);

            setError('Failed to create track');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ mb: 3 }}
                >
                    Add track
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

                    <FormControl
                        fullWidth
                        margin="normal"
                        required
                    >
                        <InputLabel id="track-artist-label">
                            Artist
                        </InputLabel>
                        <Select
                            labelId="track-artist-label"
                            value={artist}
                            label="Artist"
                            onChange={(e) =>
                                setArtist(e.target.value)
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
                    <FormControl
                        fullWidth
                        margin="normal"
                        required
                        disabled={artist === ''}
                    >
                        <InputLabel id="track-album-label">
                            Album
                        </InputLabel>
                        <Select
                            labelId="track-album-label"
                            value={album}
                            label="Album"
                            onChange={(e) =>
                                setAlbum(e.target.value)
                            }
                        >
                            {albums.map((item) => (
                                <MenuItem
                                    value={item._id}
                                    key={item._id}
                                >
                                    {item.name} ({item.year})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Track number"
                        value={trackNumber}
                        onChange={(e) =>
                            setTrackNumber(e.target.value)
                        }
                        margin="normal"
                        slotProps={{
                            htmlInput: {
                                min: 1,
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        required
                        label="Duration"
                        placeholder="3:45"
                        value={duration}
                        onChange={(e) =>
                            setDuration(e.target.value)
                        }
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="YouTube URL"
                        value={youtubeUrl}
                        onChange={(e) =>
                            setYoutubeUrl(e.target.value)
                        }
                        margin="normal"
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={ loading || artist === '' || album === '' }
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'Creating...' : 'Create track'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddTrackPage;