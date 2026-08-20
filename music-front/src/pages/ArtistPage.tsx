import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, CircularProgress, Grid } from '@mui/material';
import axiosApi from '../api/axiosApi';
import type { Album, Artist } from '../types';
import AlbumCard from '../components/AlbumCard';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const ArtistPage = () => {
    const { id = null } = useParams();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ArtistPage;