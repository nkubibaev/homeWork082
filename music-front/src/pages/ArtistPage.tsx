import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Button, CircularProgress, Grid, Typography} from '@mui/material';
import axiosApi from '../api/axiosApi';
import type { Album, Artist } from '../types';
import AlbumCard from '../components/AlbumCard';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';
import { canDeleteEntity, canPublishEntity } from '../utils/entityPermissions';
import {useAuthStore} from "../store/authStore.ts";

const ArtistPage = () => {
    const { id = null } = useParams();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (id === null) {
            setError('Artist ID is missing');
            setLoading(false);

            return;
        }

        const fetchArtist = async () => {
            try {
                setLoading(true);
                setError(null);

                const [ artistResponse, albumsResponse ] = await Promise.all([
                    axiosApi.get<Artist>(`/artists/${id}`),
                    axiosApi.get<Album[]>(`/albums?artist=${id}`)
                ]);

                setArtist(artistResponse.data);
                setAlbums(albumsResponse.data);
            } catch {
                setError('Failed to load artist data');
            } finally {
                setLoading(false);
            }
        };

        void fetchArtist();
    }, [id]);

    const handleDelete = async () => {
        if (artist === null) {
            return;
        }

        if (!canDeleteEntity(user, artist)) {
            return;
        }

        try {
            await axiosApi.delete(
                `/artists/${artist._id}`,
            );

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleTogglePublished = async () => {
        if (artist === null) {
            return;
        }

        if (!canPublishEntity(user)) {
            return;
        }

        try {
            const response = await axiosApi.patch<Artist>(
                `/artists/${artist._id}/togglePublished`,
            );

            setArtist(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error !== null) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    if (artist === null) {
        return (
            <Alert severity="error">
                Artist not found
            </Alert>
        );
    }

    return (
        <>
            <BackButton
                to="/"
                text="Back to artists"
            />
            <PageTitle
                title={artist.name}
                subtitle="Albums"
            />
            <Grid container spacing={3}>
                {albums.map((album) => (
                    <Grid
                        key={album._id}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                        }}
                    >
                        <AlbumCard album={album} />
                        {!artist.isPublished && (
                            <Typography
                                color="warning.main"
                                sx={{
                                    fontWeight: 700,
                                    mt: 1,
                                }}
                            >
                                Not published
                            </Typography>
                        )}
                        {canDeleteEntity(user, artist) && (
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={() =>
                                    void handleDelete()
                                }
                            >
                                Delete
                            </Button>
                        )}

                        {canPublishEntity(user) &&
                            !artist.isPublished && (
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        void handleTogglePublished()
                                    }
                                >
                                    Publish
                                </Button>
                            )}
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ArtistPage;