import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Grid } from '@mui/material';
import axiosApi from '../api/axiosApi';
import type { Artist } from '../types';
import ArtistCard from '../components/ArtistCard';
import PageTitle from '../components/PageTitle';

const ArtistsPage = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axiosApi.get<Artist[]>('/artists');

                setArtists(response.data);
            } catch {
                setError('Failed to load artists');
            } finally {
                setLoading(false);
            }
        };

        void fetchArtists();
    }, []);

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

    return (
        <>
            <PageTitle
                title="Artists"
                subtitle="Choose an artist to see their albums"
            />
            <Grid container spacing={3}>
                {artists.map((artist) => (
                    <Grid key={artist._id}
                          size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                          }}
                    >
                        <ArtistCard artist={artist} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ArtistsPage;